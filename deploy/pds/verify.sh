#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

hostname="${1:-}"
if [[ -z "${hostname}" ]]; then
  echo "usage: $0 <pds-hostname>" >&2
  exit 1
fi

base_url="https://${hostname}"
curl --fail --silent --show-error "${base_url}/xrpc/_health" | jq .
curl --fail --silent --show-error "${base_url}/xrpc/com.atproto.server.describeServer" | jq .
curl --fail --silent --show-error "${base_url}/.well-known/did.json" | jq .

echo "HTTP, server description, and did:web checks passed for ${hostname}."
