# WSL Development

OnlyMen uses one Linux-native checkout at `/home/jerry/onlymen` in the
`Ubuntu-26.04` WSL 2 distribution. Git and project commands must run inside
WSL. Windows PowerShell, VS Code, and the browser are the desktop interface.

## First-time setup

Start Docker Desktop and ensure **Use the WSL 2 based engine** and the
`Ubuntu-26.04` integration are enabled. Do not install Docker Engine separately
inside Ubuntu.

After `/etc/wsl.conf` is updated, save any active WSL work and apply it once
from Windows PowerShell:

```powershell
wsl.exe --shutdown
```

Open the repository in a WSL-connected VS Code window:

```powershell
code --remote wsl+Ubuntu-26.04 /home/jerry/onlymen
```

Run the bootstrap from Windows PowerShell:

```powershell
$OnlyMen = '\\wsl.localhost\Ubuntu-26.04\home\jerry\onlymen\scripts\dev\onlymen.ps1'
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen bootstrap
```

Bootstrap installs the Linux build tools, Node 24.18.0, isolated pnpm 11.11.0
and 11.13.1 launchers, frozen dependencies, ATProto code generation, and the
initial ATProto build. Package installation and builds run sequentially for
the machine's 8 GB memory limit.

## Daily commands

The PowerShell wrapper always delegates work to Ubuntu:

```powershell
$OnlyMen = '\\wsl.localhost\Ubuntu-26.04\home\jerry\onlymen\scripts\dev\onlymen.ps1'

powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen doctor
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen start
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen status
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen logs atproto-stack
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen attach
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen verify
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen stop
```

The per-process bypass is required because this machine's PowerShell policy
treats scripts under `\\wsl.localhost` as remote. It does not change the
machine's saved execution policy.

The same operations are available from a WSL terminal or the VS Code tasks:

```bash
scripts/dev/onlymen doctor
scripts/dev/onlymen start
scripts/dev/onlymen status
scripts/dev/onlymen logs app-web
scripts/dev/onlymen attach
scripts/dev/onlymen stop
```

`start` creates a detached `tmux` session named `onlymen-dev` with:

- `atproto-watch` — the ATProto TypeScript compiler watcher.
- `atproto-stack` — the seeded PDS, AppView, Ozone, bsync, PLC, Postgres, and
  Redis development stack.
- `app-web` — Expo web with
  `EXPO_PUBLIC_DEFAULT_SERVICE_URL=http://localhost:2583`.

`stop` sends an interrupt to each process so the ATProto helper can remove its
disposable Postgres and Redis test containers. It does not stop Docker Desktop
or remove unrelated containers.

## Local services

| Service | URL |
| --- | --- |
| Introspection | `http://localhost:2581` |
| PLC placeholder | `http://localhost:2582` |
| PDS | `http://localhost:2583` |
| AppView | `http://localhost:2584` |
| Ozone | `http://localhost:2587` |
| Expo web | `http://localhost:8081` |

Bsync and feed-generator ports are assigned dynamically and are printed in the
ATProto stack logs.

Seeded accounts:

| Handle | Password |
| --- | --- |
| `alice.test` | `hunter2` |
| `bob.test` | `hunter2` |
| `carla.test` | `hunter2` |

The database and seeded data are disposable. Restarting the stack creates a
clean environment.

## App and AT Protocol workflow

The local endpoint override is intentionally development-only. With
`EXPO_PUBLIC_DEFAULT_SERVICE_URL` unset, the app continues to default to
`https://bsky.social`.

When changing ATProto Lexicons:

```bash
cd /home/jerry/onlymen/atproto
~/.local/share/onlymen/pnpm/11.11.0/node_modules/.bin/pnpm codegen
```

Run codegen before build or test because Lexicons are the API and data
contract.

Do not run Windows Git, Node, or pnpm against
`\\wsl.localhost\Ubuntu-26.04\home\jerry\onlymen`. Use the WSL terminal or
invoke them through `wsl.exe`; Windows access to the path is only for the small
PowerShell wrapper and desktop editors connected through the VS Code WSL
extension.

## Troubleshooting

- `doctor` reports a Windows executable for Node or pnpm: run
  `wsl.exe --shutdown` so the updated `appendWindowsPath=false` setting takes
  effect.
- Docker is unavailable: start Docker Desktop, select Linux containers, and
  confirm the `Ubuntu-26.04` WSL integration.
- A port is busy: run `scripts/dev/onlymen status`, then stop the owning
  OnlyMen session or the unrelated process before restarting.
- A generated ATProto import is missing: run `scripts/dev/onlymen bootstrap`
  or rerun `pnpm codegen` with the ATProto pnpm launcher.
- The app still targets Bluesky: stop and restart `app-web`, then verify the
  environment shown by `scripts/dev/onlymen logs app-web`.
