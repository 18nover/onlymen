#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

readonly DEPLOY_DIR="${APPVIEW_DEPLOY_DIR:-/srv/onlymen/appview}"
readonly COMPOSE_FILE="${DEPLOY_DIR}/compose.yaml"
readonly IMAGE_ENV="${DEPLOY_DIR}/image.env"
readonly DATA_DIR="${DEPLOY_DIR}/data"
readonly BACKUP_DIR="${DEPLOY_DIR}/backups"
readonly BACKUP_RETENTION="${APPVIEW_BACKUP_RETENTION:-7}"
readonly SERVICES=(bsky bsky-indexer ozone bsync)

desired_bsky_image="${1:-}"
desired_bsky_indexer_image="${2:-}"
desired_ozone_image="${3:-}"
desired_bsync_image="${4:-}"
api_public_url="${5:-}"
mod_public_url="${6:-}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_file="${BACKUP_DIR}/appview-data-${timestamp}.tar.gz"
failed_data_dir="${DEPLOY_DIR}/data.failed-${timestamp}"
caddy_network="${CADDY_NETWORK:-}"
backup_created=false
declare -A previous_image=()

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

validate_image() {
  local name="$1"
  local image="$2"
  [[ "${image}" =~ ^ghcr\.io/18nover/onlymen-${name}:sha-[0-9a-f]{40}$ ]] \
    || fail "expected an immutable ghcr.io/18nover/onlymen-${name}:sha-<40 hex> image, got '${image}'"
}

validate_image bsky "${desired_bsky_image}"
validate_image bsky-indexer "${desired_bsky_indexer_image}"
validate_image ozone "${desired_ozone_image}"
validate_image bsync "${desired_bsync_image}"
[[ "${api_public_url}" =~ ^https://[^/]+/?$ ]] || fail "expected the public AppView URL as https://hostname"
[[ "${mod_public_url}" =~ ^https://[^/]+/?$ ]] || fail "expected the public Ozone URL as https://hostname"
if [[ "${DEPLOY_DIR}" != /* || "${DEPLOY_DIR}" == "/" ]]; then
  fail "APPVIEW_DEPLOY_DIR must be a specific absolute directory"
fi
if [[ ! "${BACKUP_RETENTION}" =~ ^[1-9][0-9]*$ ]]; then
  fail "APPVIEW_BACKUP_RETENTION must be a positive integer"
fi
[[ -f "${COMPOSE_FILE}" ]] || fail "missing ${COMPOSE_FILE}"
for env_name in bsky ozone bsync postgres; do
  [[ -f "${DEPLOY_DIR}/${env_name}.env" ]] || fail "missing ${DEPLOY_DIR}/${env_name}.env"
done
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
  local temp_file
  temp_file="$(mktemp "${DEPLOY_DIR}/image.env.XXXXXX")"
  {
    printf 'BSKY_IMAGE=%s\n' "${1}"
    printf 'BSKY_INDEXER_IMAGE=%s\n' "${2}"
    printf 'OZONE_IMAGE=%s\n' "${3}"
    printf 'BSYNC_IMAGE=%s\n' "${4}"
    printf 'BSKY_ENV_FILE=%s/bsky.env\n' "${DEPLOY_DIR}"
    printf 'OZONE_ENV_FILE=%s/ozone.env\n' "${DEPLOY_DIR}"
    printf 'BSYNC_ENV_FILE=%s/bsync.env\n' "${DEPLOY_DIR}"
    printf 'POSTGRES_ENV_FILE=%s/postgres.env\n' "${DEPLOY_DIR}"
    printf 'APPVIEW_DATA_DIR=%s\n' "${DATA_DIR}"
    printf 'CADDY_NETWORK=%s\n' "${caddy_network}"
  } >"${temp_file}"
  chmod 600 "${temp_file}"
  mv "${temp_file}" "${IMAGE_ENV}"
}

wait_for_containers() {
  local attempts=36
  local all_ready
  for ((attempt = 1; attempt <= attempts; attempt += 1)); do
    all_ready=true
    for service in "${SERVICES[@]}"; do
      local container="onlymen-${service}"
      local status
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container}" 2>/dev/null || true)"
      if [[ "${status}" == "unhealthy" || "${status}" == "exited" || "${status}" == "dead" ]]; then
        return 1
      fi
      if [[ "${status}" != "healthy" && "${status}" != "running" ]]; then
        all_ready=false
      fi
    done
    [[ "${all_ready}" == true ]] && return 0
    sleep 5
  done
  return 1
}

rollback() {
  local exit_code=$?
  trap - ERR
  set +o errexit
  echo "Deployment failed; preserving logs and restoring the previous release." >&2
  compose logs --no-color "${SERVICES[@]}" postgres redis >"${BACKUP_DIR}/deploy-failure-${timestamp}.log" 2>&1
  compose stop "${SERVICES[@]}" postgres redis

  if [[ "${backup_created}" == true ]]; then
    if ! mv "${DATA_DIR}" "${failed_data_dir}" || \
      ! mkdir "${DATA_DIR}" || \
      ! tar --extract --gzip --file "${backup_file}" --directory "${DEPLOY_DIR}"; then
      echo "Automatic data restoration failed; leaving the AppView stack stopped." >&2
      echo "Restore ${backup_file} manually before restarting it." >&2
      exit "${exit_code}"
    fi
  fi

  if [[ -n "${previous_image[bsky]:-}" ]]; then
    if ! write_image_env \
      "${previous_image[bsky]}" "${previous_image[bsky-indexer]}" \
      "${previous_image[ozone]}" "${previous_image[bsync]}"; then
      echo "Could not restore the prior image configuration; leaving the stack stopped." >&2
      exit "${exit_code}"
    fi
    compose up --detach --force-recreate "${SERVICES[@]}" postgres redis
    wait_for_containers || true
  fi

  echo "Failed data, when present, was retained at ${failed_data_dir}." >&2
  exit "${exit_code}"
}
trap rollback ERR

if [[ -f "${IMAGE_ENV}" ]]; then
  previous_image[bsky]="$(sed -n 's/^BSKY_IMAGE=//p' "${IMAGE_ENV}" | tail -n 1)"
  previous_image[bsky-indexer]="$(sed -n 's/^BSKY_INDEXER_IMAGE=//p' "${IMAGE_ENV}" | tail -n 1)"
  previous_image[ozone]="$(sed -n 's/^OZONE_IMAGE=//p' "${IMAGE_ENV}" | tail -n 1)"
  previous_image[bsync]="$(sed -n 's/^BSYNC_IMAGE=//p' "${IMAGE_ENV}" | tail -n 1)"
  if [[ -z "${caddy_network}" ]]; then
    caddy_network="$(sed -n 's/^CADDY_NETWORK=//p' "${IMAGE_ENV}" | tail -n 1)"
  fi
fi
caddy_network="${caddy_network:-caddy}"

echo "Stopping the AppView stack for a consistent filesystem backup."
if docker inspect onlymen-appview-postgres >/dev/null 2>&1; then
  compose stop "${SERVICES[@]}" postgres redis
fi
tar --create --gzip --file "${backup_file}" --directory "${DEPLOY_DIR}" data
backup_created=true

write_image_env \
  "${desired_bsky_image}" "${desired_bsky_indexer_image}" \
  "${desired_ozone_image}" "${desired_bsync_image}"
docker pull "${desired_bsky_image}"
docker pull "${desired_bsky_indexer_image}"
docker pull "${desired_ozone_image}"
docker pull "${desired_bsync_image}"
compose up --detach --force-recreate "${SERVICES[@]}" postgres redis
wait_for_containers
curl --fail --silent --show-error "${api_public_url%/}/xrpc/_health" >/dev/null
curl --fail --silent --show-error "${mod_public_url%/}/xrpc/_health" >/dev/null

trap - ERR
mapfile -t backups < <(find "${BACKUP_DIR}" -maxdepth 1 -type f -name 'appview-data-*.tar.gz' -printf '%T@ %p\n' | sort --numeric-sort --reverse | cut -d' ' -f2-)
for ((index = BACKUP_RETENTION; index < ${#backups[@]}; index += 1)); do
  rm --force -- "${backups[index]}"
done

echo "AppView deployment is healthy: ${desired_bsky_image}, ${desired_bsky_indexer_image}, ${desired_ozone_image}, ${desired_bsync_image}"
