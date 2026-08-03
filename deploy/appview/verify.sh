#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

api_hostname="${1:-}"
mod_hostname="${2:-}"
if [[ -z "${api_hostname}" || -z "${mod_hostname}" ]]; then
  echo "usage: $0 <appview-hostname> <ozone-hostname>" >&2
  exit 1
fi

api_url="https://${api_hostname}"
mod_url="https://${mod_hostname}"

curl --fail --silent --show-error "${api_url}/xrpc/_health" | jq .
curl --fail --silent --show-error "${api_url}/.well-known/did.json" | jq .
curl --fail --silent --show-error "${mod_url}/xrpc/_health" | jq .

echo "HTTP, health, and did:web checks passed for ${api_hostname} and ${mod_hostname}."
echo "Still manual: post a test record and confirm it is visible through ${api_hostname}," \
  "then file a test report and confirm it reaches ${mod_hostname}'s moderation queue."
