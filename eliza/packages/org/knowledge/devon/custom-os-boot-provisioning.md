# Custom OS — Boot & Provisioning (Devon)

Your DevOps lens on Custom OS: what makes the boot partition bootable, how
A/B tryboot delivers safe updates, and how cloud-init provisions a fresh
device. See `shared/custom-os.md` for the full primer.

## What has to be present for a bootable SD card

- `bootcode.bin` — first-stage bootloader, Pi 3 only (Pi 4/5 boot from
  on-SoC firmware instead).
- `start*.elf` + matching `fixup*.dat` — GPU firmware; there are variant
  pairs per SoC (`start4.elf`/`fixup4.dat` for Pi 4, `start4cd.elf`/etc. for
  camera/display variants). Ship the wrong pair and the board won't get a
  display or boots to a black screen.
- `config.txt` — arm64 mode, KMS (`vc4-kms-v3d` overlay) for full kernel
  modesetting, and any board-specific overlay selection.
- `current/vmlinuz`, `current/initrd.img`, `current/cmdline.txt`,
  `current/bcm27*.dtb` — the kernel, initrd, kernel command line, and the
  device tree matching the target SoC.

## A/B tryboot — treat it like a deployment pipeline

`autoboot.txt` plus `current/state` (`"good"` or `"new"`) is the rollback
mechanism: a new image boots as "new," and only gets promoted to "good"
after it proves it can boot successfully. This is the same shape as a
blue/green deploy — don't ship an update path that skips the "new" → "good"
promotion step, since that's what prevents a bad update from bricking a
device with no physical console access.

## cloud-init as the provisioning layer

`user-data` (cloud-config) and `meta-data` are the first-boot provisioning
surface — packages, users, networking, swap. Current state ships
`users: []` (relies on interactive first-run setup) and a 1GB swap file;
most of the file is commented-out examples (`chpasswd`, `ssh_import_id`,
`write_files`, `runcmd`). If a real deployment pipeline needs non-interactive
provisioning, that means uncommenting and filling in these blocks — coordinate
with Seth before doing that, since this is exactly where secrets/passwords
would leak if done carelessly (see Seth's `custom-os-boot-security.md`).

## CI/CD gap

There is currently **no automated image build pipeline** for Custom OS — no
CI workflow builds or tests the boot partition. The project roadmap
(`custom-os/README.md` → "Image build pipeline") calls this out as planned,
not shipped. Don't assume a build step exists; verify against
`custom-os/.github/` (if present) before referencing CI behavior.

## Verify before asserting

Boot file inventory: `custom-os/*` (top level) and `custom-os/current/`.
Overlay count and coverage: `custom-os/current/overlays/`. Roadmap status:
`custom-os/README.md` → "Roadmap" checklist (unchecked items are not done).
