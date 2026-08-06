# OnlyMen Hybrid Windows + Raspberry Pi Workflow

This guide matches the current architecture described by the repository:

- **Windows:** UI development, rebranding, Expo web, Android via `adb`, VS Code,
  PowerShell, and browser testing.
- **Raspberry Pi (`lockard-tech`):** Dockerized PDS, AppView, Ozone, Bsync,
  databases, and backend/integration services.
- **GitHub:** shared source history and CI image builds.
- **SSH:** administration and deployment access to the Pi.

The Windows checkout is `C:\18nover\onlymen`.
The Pi checkout is documented as `/home/admin/onlymen`.

## The daily mental model

Do not try to make Windows and the Pi behave like one shared filesystem.
Treat them as two coordinated workstations with different jobs:

```text
Windows edit/test cycle
  edit UI -> run web/Android -> run focused checks -> commit/push

Pi integration cycle
  pull the commit -> start Docker services -> test PDS/AppView behavior

Production cycle
  merge to main -> GitHub Actions verify/build/publish -> SSH deploy immutable images
```

Use Git to mirror source changes. Do not rsync `node_modules`, live database
volumes, or generated runtime data between Windows and the ARM64 Pi.

## Windows: normal UI work

Open `C:\18nover\onlymen` in VS Code and use a PowerShell terminal.
Run UI commands from `C:\18nover\onlymen\app`:

```powershell
Set-Location C:\18nover\onlymen\app
pnpm start
```

Useful app-local commands:

```powershell
pnpm web
pnpm lint
pnpm typecheck
pnpm test
pnpm prettier
pnpm build-web
```

The app's `package.json` requires Node `>=24.18.0` and pnpm `11.13.1`.
Use the repository's pinned versions rather than a globally different version.
The app guide says not to run translation extraction/compilation casually;
those jobs are handled by CI.

## Windows: commit and publish UI changes

Before committing:

```powershell
Set-Location C:\18nover\onlymen
git status
git diff --check
Set-Location app
pnpm lint
pnpm typecheck
pnpm test
Set-Location ..
git add app
git commit -m "Describe the UI change"
git push
```

Prefer a feature branch and pull request rather than editing the Pi checkout
and committing there independently.

## Pi: connect and inspect the backend

From a second PowerShell terminal on Windows:

```powershell
ssh lockard-tech
Set-Location /home/admin/onlymen
```

The handoff documents a passwordless SSH alias for `lockard-tech` using the
`admin` account and an SSH key. Verify that alias rather than hard-coding an
IP address in scripts.

The Pi is ARM64 and intentionally has no Node/pnpm/bun/tmux requirement. Its
backend path is Docker Compose:

```bash
cd /home/admin/onlymen
git status
git pull --ff-only
docker compose config
docker compose up -d pds
docker compose ps
docker compose logs --tail=100 pds
```

For the local AppView profile, first confirm the required environment values
and then use the repository's documented profile:

```bash
docker compose --profile appview up -d
docker compose --profile appview ps
docker compose --profile appview logs --tail=100
```

Do not use the WSL-oriented `make start`/tmux launcher as the Pi's normal
backend workflow. The Pi is using Docker services, not native package scripts.

## Pi: pull policy

A safe integration cycle is:

```bash
cd /home/admin/onlymen
git status
# Stop if there are uncommitted backend/config changes.
git pull --ff-only
docker compose up -d pds
```

If `git status` reports changes, do not overwrite them with `git pull`.
Inspect them first and decide whether they are intentional server-only config,
local experimentation, or work that must be committed and pushed.

## What belongs on which machine

| Work | Windows | Pi |
|---|---:|---:|
| React Native/Expo UI | Yes | No |
| Rebranding and assets | Yes | No |
| `pnpm web` and Android/ADB | Yes | No |
| App lint/typecheck/Jest | Yes | No |
| PDS Docker service | No | Yes |
| AppView/Ozone/Bsync Docker services | No | Yes |
| Backend data volumes | No | Yes |
| Production deploy scripts | Usually triggered by CI | Executes on host |
| Git commit creation | Prefer Windows for UI | Only for deliberate backend changes |

## Production deployment path

The workflows under `.github/workflows/` do not pull source and build directly
on the Pi. They:

1. Check out the commit on GitHub Actions.
2. Install the AT Protocol dependencies.
3. Verify/build the PDS or AppView packages.
4. Build immutable GHCR images tagged with the commit SHA.
5. SSH to the configured deployment host.
6. Run `/srv/onlymen/pds/deploy.sh` or `/srv/onlymen/appview/deploy.sh`.

That means a merge to `main` can deploy without Node/pnpm on the Pi. The Pi
still needs Docker, the deployment directories, secrets, Caddy networking,
and the configured GitHub Actions SSH secrets.

PDS deployment uses these GitHub secrets:

- `PDS_DEPLOY_HOST`
- `PDS_DEPLOY_USER`
- `PDS_DEPLOY_SSH_KEY`
- `PDS_DEPLOY_KNOWN_HOSTS`
- `PDS_PUBLIC_URL`

AppView deployment uses the corresponding `APPVIEW_DEPLOY_*` secrets plus
`APPVIEW_PUBLIC_URL` and `OZONE_PUBLIC_URL`.

## Important separation: dev Pi vs production host

The repository documents a dev-only Pi PDS at `/home/admin/onlymen` and a
production deployment layout at `/srv/onlymen/pds` and `/srv/onlymen/appview`.
Do not assume these are the same data or deployment directory.

The production deploy scripts back up data, pull immutable GHCR images, recreate
containers, run health checks, and attempt rollback on failure. Do not run them
manually unless you understand the target directory and image arguments.

## Current audit findings

1. The mistaken nested `C:\18nover\onlymen\onlymen` checkout is no longer
   present in the current scan.
2. `bin\om.cmd` still forwards to `/home/jerry/onlymen` in WSL, so it is not the
   correct entry point for the new Windows + Pi workflow.
3. The README and Makefile still expose WSL/tmux commands prominently, even
   though the handoff says WSL is no longer primary.
4. The Pi's Docker workflow is the correct backend path because the handoff
   explicitly says Node/pnpm/bun/tmux are not installed there.
5. The GitHub Actions deployment is image-based and SSH-based; it is separate
   from manually pulling the Pi checkout for integration testing.
6. The PDS environment file in the checkout contains placeholder values. Never
   put real production secrets in Git; keep production secrets in the host's
   `/srv/onlymen/...` directories or GitHub Actions secrets.

## Recommended next changes

1. Replace or clearly retire `bin\om.cmd` so it no longer suggests the old WSL
   path is the normal Windows workflow.
2. Add a small PowerShell helper for Windows app commands and a small SSH helper
   for Pi Docker status/logs. Keep both read-only at first.
3. Decide whether the Pi checkout is for integration testing only or also for
   source builds. The documented setup favors Docker-only operation.
4. Add a short root README section linking to this guide.
5. Add a pre-push secret scan before real PDS/AppView credentials are introduced.
