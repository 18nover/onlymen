# WSL Development

OnlyMen has one authoritative checkout: `/home/jerry/onlymen` in the
`Ubuntu-26.04` WSL 2 distribution. Git, Node, pnpm, Bun, Claude, Codex,
elizaOS, Expo, and AT Protocol commands run in WSL. Windows is the desktop
surface for PowerShell, VS Code, the browser, and Docker Desktop.

Do not run Windows Git or JavaScript tooling against the UNC path. The older
`C:\Users\jerry\projects\onlymen` checkout must remain untouched until its
uncommitted work has been reconciled.

## First-time setup

Enable Docker Desktop's WSL 2 engine and its `Ubuntu-26.04` integration. Do not
install a second Docker Engine inside Ubuntu.

From PowerShell, bootstrap the Linux tools and install the short Windows
launcher:

```powershell
$OnlyMen = '\\wsl.localhost\Ubuntu-26.04\home\jerry\onlymen\scripts\dev\onlymen.ps1'
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $OnlyMen bootstrap
```

Bootstrap installs or validates the project toolchain, WSL-native Claude and
Codex CLIs, GitHub CLI, frozen dependencies, AT Protocol code generation, and
the launchers:

- PowerShell or Command Prompt: `om`
- WSL Bash: `om`

Open a WSL shell and complete the interactive logins once:

```powershell
om shell
```

```bash
claude
gh auth login
om auth
```

Codex authentication is also checked by `om auth`; run `codex login` if it
reports missing credentials. Credentials stay native to WSL and are never
copied from Windows.

## Daily workflow

The same commands work from PowerShell and WSL:

```text
om doctor
om start
om status
om open agents
om open app
om logs org-console
om attach
om verify org
om stop
```

Useful start profiles:

- `om start agents` starts only the engineering office.
- `om start stack` starts AT Protocol and the app.
- `om start all` or `om start` starts both.

`om open code` opens the canonical checkout through VS Code Remote - WSL.
`om shell` opens Bash directly in `/home/jerry/onlymen`.

## Supervised services

The launcher owns a detached tmux session named `onlymen-dev`. Depending on the
selected profile, it contains:

- `org-console` - engineering office and agent supervisor.
- `atproto-watch` - AT Protocol TypeScript watcher.
- `atproto-stack` - seeded PDS, AppView, Ozone, bsync, PLC, Postgres, and Redis.
- `app-web` - Expo web pointed at the local PDS.

`om stop` sends an interrupt to each service so the AT Protocol helper can
remove its disposable containers. It does not stop Docker Desktop or unrelated
containers.

## Local endpoints

| Service | URL |
| --- | --- |
| Engineering office | `http://localhost:4173` |
| Agent API base | `http://localhost:2140` |
| Introspection | `http://localhost:2581` |
| PLC placeholder | `http://localhost:2582` |
| PDS | `http://localhost:2583` |
| AppView | `http://localhost:2584` |
| Ozone | `http://localhost:2587` |
| Expo web | `http://localhost:8082` |

Seeded disposable accounts use password `hunter2`: `alice.test`, `bob.test`,
and `carla.test`.

## Protocol and branding boundary

OnlyMen product names, visuals, copy, navigation, and product behavior can be
rebranded. Existing `app.bsky.*` Lexicons, NSIDs, wire formats, service
contracts, generated schemas, and interoperability behavior are protocol
compatibility boundaries. They are not renamed merely because the product is
renamed.

When changing an AT Protocol Lexicon, run code generation before build or test:

```bash
cd /home/jerry/onlymen/atproto
~/.local/share/onlymen/pnpm/11.11.0/node_modules/.bin/pnpm codegen
```

## Troubleshooting

- A WSL command resolves to a Windows executable: run `wsl.exe --shutdown`,
  reopen Ubuntu, and check `/etc/wsl.conf` has `appendWindowsPath=false`.
- Docker is unavailable: start Docker Desktop and check its Ubuntu integration.
- A port is busy: run `om status`, then stop the owning process or `om stop`.
- Agent authentication is missing: run `om shell`, then `claude`,
  `codex login`, and `gh auth login`.
- The app still targets Bluesky: restart `app-web` and inspect
  `om logs app-web`.
- A generated AT Protocol import is missing: rerun `om bootstrap` or the
  Lexicon code-generation command above.
