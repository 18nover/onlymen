# Custom OS — System & Kernel Configuration (Morgan)

Your backend-architecture instincts transfer to Custom OS at the systems
layer: kernel configuration, storage, and networking — but this is OS-level
config, not application backend work. See `shared/custom-os.md` for the full
primer; don't conflate this with OnlyMen's PDS/AppView work.

## Kernel command line and boot config

`current/cmdline.txt` is the kernel command line for the active partition;
`config.txt` sets boot-time hardware config (arm64 mode, KMS graphics via
the `vc4-kms-v3d` overlay, camera/display auto-detection on CSI/DSI). Treat
these two files as the system's equivalent of environment-driven service
config — a wrong value here fails closed (won't boot or won't get a display)
rather than degrading gracefully, so changes need to be tested on real
hardware (coordinate with Quinn) before being treated as done.

## Storage and swap

`user-data` provisions a 1GB swap file (`swap: filename: /swapfile, size:
1G`) via cloud-init on first boot. On RAM-constrained boards (Pi Zero 2, Pi
3 with 512MB–1GB RAM) this is a meaningful sizing decision, not a default to
leave unexamined — cross-check with Parker before changing it, since swap
size trades off against SD card write endurance and boot-time initialization
cost.

## Networking

Custom OS's `user-data` currently has no explicit networking configuration —
it relies on cloud-init/NetworkManager defaults and the commented-out
`packages`/`write_files`/`runcmd` blocks for anything custom. If a real
deployment needs static IPs, Wi-Fi provisioning, or firewall rules, that
config lands in `user-data` (cloud-init's `network:` key or a `write_files`
entry) — this is the same "config as the interface, not hand-editing a
running system" principle as `docker-compose.yml` in the app/atproto stacks.

## Where this differs from your OnlyMen work

There is no PDS, no AppView, no Postgres/Redis here — this is bare-metal/
firmware territory. Your value-add is the same discipline (config is a
contract, changes should be reversible, don't hand-tune a running system)
applied to boot config instead of API schemas.

## Verify before asserting

Kernel/boot config: `custom-os/config.txt`, `custom-os/current/cmdline.txt`.
Provisioning: `custom-os/user-data`, `custom-os/meta-data`. Don't assume
services beyond what's in these files exist — Custom OS ships no application
services today.
