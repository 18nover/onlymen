#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

readonly DEPLOY_DIR="${PDS_DEPLOY_DIR:-/srv/onlymen/pds}"
readonly COMPOSE_FILE="${DEPLOY_DIR}/compose.yaml"
readonly IMAGE_ENV="${DEPLOY_DIR}/image.env"
readonly DATA_DIR="${DEPLOY_DIR}/data"
readonly BACKUP_DIR="${DEPLOY_DIR}/backups"
readonly CONTAINER_NAME="onlymen-pds"
readonly BACKUP_RETENTION="${PDS_BACKUP_RETENTION:-7}"

desired_image="${1:-}"
public_url="${2:-}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_file="${BACKUP_DIR}/pds-data-${timestamp}.tar.gz"
failed_data_dir="${DEPLOY_DIR}/data.failed-${timestamp}"
previous_image=""
caddy_network="${CADDY_NETWORK:-}"
backup_created=false

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

if [[ ! "${desired_image}" =~ ^ghcr\.io/18nover/onlymen-pds:sha-[0-9a-f]{40}$ ]]; then
  fail "expected an immutable ghcr.io/18nover/onlymen-pds:sha-<40 hex> image"
fi
if [[ ! "${public_url}" =~ ^https://[^/]+/?$ ]]; then
  fail "expected the public PDS URL as https://hostname"
fi
if [[ "${DEPLOY_DIR}" != /* || "${DEPLOY_DIR}" == "/" ]]; then
  fail "PDS_DEPLOY_DIR must be a specific absolute directory"
fi
if [[ ! "${BACKUP_RETENTION}" =~ ^[1-9][0-9]*$ ]]; then
  fail "PDS_BACKUP_RETENTION must be a positive integer"
fi
[[ -f "${COMPOSE_FILE}" ]] || fail "missing ${COMPOSE_FILE}"
[[ -f "${DEPLOY_DIR}/pds.env" ]] || fail "missing ${DEPLOY_DIR}/pds.env"
[[ -f "${IMAGE_ENV}" ]] || fail "missing ${IMAGE_ENV}"
[[ -d "${DATA_DIR}" ]] || fail "missing ${DATA_DIR}"
mkdir -p "${BACKUP_DIR}"

compose() {
  docker compose \
    --project-directory "${DEPLOY_DIR}" \
    --env-file "${IMAGE_ENV}" \
    --file "${COMPOSE_FILE}" \
    "$@"
}

write_image_env() {
  local image="$1"
  local temp_file
  temp_file="$(mktemp "${DEPLOY_DIR}/image.env.XXXXXX")"
  {
    printf 'PDS_IMAGE=%s\n' "${image}"
    printf 'PDS_ENV_FILE=%s/pds.env\n' "${DEPLOY_DIR}"
    printf 'PDS_DATA_DIR=%s/data\n' "${DEPLOY_DIR}"
    printf 'CADDY_NETWORK=%s\n' "${caddy_network}"
  } >"${temp_file}"
  chmod 600 "${temp_file}"
  mv "${temp_file}" "${IMAGE_ENV}"
}

wait_for_container() {
  local attempts=36
  local status
  for ((attempt = 1; attempt <= attempts; attempt += 1)); do
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${CONTAINER_NAME}" 2>/dev/null || true)"
    if [[ "${status}" == "healthy" ]]; then
      return 0
    fi
    if [[ "${status}" == "unhealthy" || "${status}" == "exited" || "${status}" == "dead" ]]; then
      return 1
    fi
    sleep 5
  done
  return 1
}

rollback() {
  local exit_code=$?
  trap - ERR
  set +o errexit
  echo "Deployment failed; preserving logs and restoring the previous release." >&2
  compose logs --no-color pds >"${BACKUP_DIR}/deploy-failure-${timestamp}.log" 2>&1
  compose stop pds

  if [[ "${backup_created}" == true ]]; then
    if ! mv "${DATA_DIR}" "${failed_data_dir}" || \
      ! mkdir "${DATA_DIR}" || \
      ! tar --extract --gzip --file "${backup_file}" --directory "${DEPLOY_DIR}"; then
      echo "Automatic data restoration failed; leaving the PDS stopped." >&2
      echo "Restore ${backup_file} manually before restarting it." >&2
      exit "${exit_code}"
    fi
  fi

  if [[ -n "${previous_image}" ]]; then
    if ! write_image_env "${previous_image}"; then
      echo "Could not restore the prior image configuration; leaving the PDS stopped." >&2
      exit "${exit_code}"
    fi
    compose up --detach --force-recreate pds
    wait_for_container || true
  fi

  echo "Failed data, when present, was retained at ${failed_data_dir}." >&2
  exit "${exit_code}"
}
trap rollback ERR

if [[ -f "${IMAGE_ENV}" ]]; then
  previous_image="$(sed -n 's/^PDS_IMAGE=//p' "${IMAGE_ENV}" | tail -n 1)"
  if [[ -z "${caddy_network}" ]]; then
    caddy_network="$(sed -n 's/^CADDY_NETWORK=//p' "${IMAGE_ENV}" | tail -n 1)"
  fi
fi
caddy_network="${caddy_network:-caddy}"
if [[ -z "${previous_image}" ]] && docker inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
  previous_image="$(docker inspect --format '{{.Config.Image}}' "${CONTAINER_NAME}")"
fi

echo "Stopping PDS for a consistent filesystem backup."
if docker inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
  compose stop pds
fi
tar --create --gzip --file "${backup_file}" --directory "${DEPLOY_DIR}" data
backup_created=true

write_image_env "${desired_image}"
docker pull "${desired_image}"
compose up --detach --force-recreate pds
wait_for_container
curl --fail --silent --show-error "${public_url%/}/xrpc/_health" >/dev/null

trap - ERR
mapfile -t backups < <(find "${BACKUP_DIR}" -maxdepth 1 -type f -name 'pds-data-*.tar.gz' -printf '%T@ %p\n' | sort --numeric-sort --reverse | cut -d' ' -f2-)
for ((index = BACKUP_RETENTION; index < ${#backups[@]}; index += 1)); do
  rm --force -- "${backups[index]}"
done

echo "PDS deployment is healthy: ${desired_image}"
