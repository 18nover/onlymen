#!/bin/sh
# Revive the OnlyMen preview. Idempotent. Bind 0.0.0.0:8080 via npm run dev.
if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8080/; then
  exit 0
fi
cd /workspace
npm run dev >/tmp/onlymen-dev.log 2>&1 &
