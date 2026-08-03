#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

readonly ENV_FILE="${PDS_ENV_FILE:-/srv/onlymen/pds/pds.env}"

email="${1:-}"
handle="${2:-}"
password="${3:-}"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

read_env() {
  local key="$1"
  sed -n "s/^${key}=//p" "${ENV_FILE}" | tail -n 1
}

[[ -f "${ENV_FILE}" ]] || fail "missing ${ENV_FILE}"
[[ -n "${email}" && -n "${handle}" ]] || fail "usage: $0 <email> <handle> [password]"

hostname="$(read_env PDS_HOSTNAME)"
admin_password="$(read_env PDS_ADMIN_PASSWORD)"
[[ -n "${hostname}" && -n "${admin_password}" ]] || fail "PDS_HOSTNAME or PDS_ADMIN_PASSWORD is missing"
[[ "${handle}" == *."${hostname}" ]] || fail "handle must be beneath ${hostname}"

if [[ -z "${password}" ]]; then
  password="$(openssl rand -base64 30 | tr -d '=+/' | cut -c1-24)"
fi

invite_code="$(curl --fail --silent --show-error \
  --request POST \
  --user "admin:${admin_password}" \
  --header 'Content-Type: application/json' \
  --data '{"useCount":1}' \
  "https://${hostname}/xrpc/com.atproto.server.createInviteCode" | jq --raw-output '.code')"

payload="$(jq --null-input --compact-output \
  --arg email "${email}" \
  --arg handle "${handle}" \
  --arg password "${password}" \
  --arg inviteCode "${invite_code}" \
  '{email: $email, handle: $handle, password: $password, inviteCode: $inviteCode}')"

result="$(curl --fail --silent --show-error \
  --request POST \
  --header 'Content-Type: application/json' \
  --data "${payload}" \
  "https://${hostname}/xrpc/com.atproto.server.createAccount")"

did="$(jq --raw-output '.did' <<<"${result}")"
[[ "${did}" == did:* ]] || fail "account response did not contain a DID"

echo "Account created successfully."
echo "Handle: ${handle}"
echo "DID: ${did}"
echo "Password: ${password}"
echo "Store the password securely; this script will not save it."
