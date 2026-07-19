#!/usr/bin/env bash
# Smoke driver for the elizaOS agent server with a onlymen org character.
# Boots the backend headless (no API keys needed — chat is served by the
# local `claude` CLI subscription via plugin-cli-inference), then drives it
# over the REST chat endpoint.
#
# Usage (from the eliza/ repo root):
#   .claude/skills/run-eliza/driver.sh start [character]   # default: atlas
#   .claude/skills/run-eliza/driver.sh health
#   .claude/skills/run-eliza/driver.sh agents
#   .claude/skills/run-eliza/driver.sh say "message text"
#   .claude/skills/run-eliza/driver.sh logs [n]
#   .claude/skills/run-eliza/driver.sh stop
#
# Env overrides: ELIZA_RUN_PORT (default 2139), ELIZA_RUN_STATE (state dir),
# ELIZA_RUN_BACKEND (claude-sdk | claude | codex; default claude-sdk).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PORT="${ELIZA_RUN_PORT:-2139}"
STATE_DIR="${ELIZA_RUN_STATE:-/tmp/eliza-run-state}"
BACKEND="${ELIZA_RUN_BACKEND:-claude-sdk}"
PID_FILE="$STATE_DIR/driver-server.pid"
LOG_FILE="$STATE_DIR/driver-server.log"
BASE="http://127.0.0.1:$PORT"

agent_id() {
  curl -s --max-time 5 "$BASE/api/agents" \
    | python3 -c 'import json,sys; print(json.load(sys.stdin)["agents"][0]["id"])'
}

case "${1:-help}" in
  start)
    CHARACTER="${2:-atlas}"
    CHAR_FILE="$REPO_ROOT/packages/org/characters/$CHARACTER.json"
    [ -f "$CHAR_FILE" ] || { echo "no such character: $CHAR_FILE" >&2; exit 1; }
    mkdir -p "$STATE_DIR"
    # Enable the org-coordinator plugin through the state config the boot reads.
    [ -f "$STATE_DIR/eliza.json" ] || cat > "$STATE_DIR/eliza.json" <<'EOF'
{
  "plugins": {
    "entries": {
      "@onlymen/plugin-org-coordinator": { "enabled": true }
    }
  }
}
EOF
    cd "$REPO_ROOT/packages/agent"
    ELIZA_STATE_DIR="$STATE_DIR" \
    ELIZA_API_PORT="$PORT" \
    ELIZA_CHAT_VIA_CLI="$BACKEND" \
    ELIZA_PLANNER_NATIVE_TOOLS=0 \
    ELIZA_AGENT_CHARACTER_JSON="$(cat "$CHAR_FILE")" \
      nohup bun --conditions=eliza-source src/bin.ts serve \
      > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "booting $CHARACTER on :$PORT (pid $(cat "$PID_FILE")) — log: $LOG_FILE"
    for _ in $(seq 1 45); do
      sleep 4
      if curl -s --max-time 2 "$BASE/api/health" 2>/dev/null | grep -q '"ready":true'; then
        echo "ready:"; curl -s "$BASE/api/health"; echo; exit 0
      fi
    done
    echo "server did not become ready within 180s — check $LOG_FILE" >&2
    exit 1
    ;;
  health)
    curl -s --max-time 5 "$BASE/api/health"; echo
    ;;
  agents)
    curl -s --max-time 5 "$BASE/api/agents"; echo
    ;;
  say)
    [ -n "${2:-}" ] || { echo "usage: driver.sh say \"message\"" >&2; exit 1; }
    ID="$(agent_id)"
    # Chat turns run through the warm claude-sdk session; first call can take
    # a couple of minutes while the session spins up.
    curl -s --max-time 300 -X POST "$BASE/api/agents/$ID/message" \
      -H 'Content-Type: application/json' \
      -d "$(python3 -c 'import json,sys; print(json.dumps({"userId":"driver","text":sys.argv[1]}))' "$2")"
    echo
    ;;
  logs)
    tail -n "${2:-40}" "$LOG_FILE"
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      kill "$(cat "$PID_FILE")" 2>/dev/null || true
      rm -f "$PID_FILE"
      echo "stopped"
    else
      echo "no pid file at $PID_FILE" >&2
    fi
    ;;
  *)
    sed -n '2,16p' "$0"
    ;;
esac
