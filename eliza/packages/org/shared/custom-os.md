# Custom OS Primer

Seven agents on this team (Devon, Morgan, Seth, Parker, Audrey, Quinn,
Penelope) also ground work in **Custom OS**, a second project maintained by
this same AI engineering organization. This is the shared mental model: what
Custom OS is, where its pieces live, and how it relates to OnlyMen.

## The one-paragraph version

Custom OS is an Ubuntu 26.04-based operating system for Raspberry Pi (Pi 3,
4, and 5 families), maintained as a plain tracked subdirectory (`custom-os/`)
of this same repo — added whole in commit `053149171` ("custom os was
added", 2026-07-22), just like `app/`, `atproto/`, and `eliza/`. There is no
separate `.git`, no submodule, no independent history; changes to Custom OS
are committed as part of this repo's normal history. It ships a bootable
partition (bootloader, GPU firmware, kernel, initrd, 367+ device tree
overlays) plus **cloud-init** provisioning (`user-data`, `meta-data`) and
**A/B tryboot** for safe, rollback-capable firmware updates.

## Boot architecture

```
custom-os/
├── bootcode.bin              # first-stage bootloader (Pi 3 only)
├── start*.elf / fixup*.dat   # GPU firmware, one pair per Pi/SoC variant
├── config.txt                # boot config: arm64, KMS (vc4-kms-v3d), overlays
├── autoboot.txt              # A/B tryboot: which partition boots, rollback logic
├── user-data / meta-data     # cloud-init: users, networking, packages, swap
└── current/                  # the active boot partition
    ├── vmlinuz, initrd.img, cmdline.txt
    ├── bcm27*.dtb             # device trees per SoC (BCM2710/2711/2712)
    ├── state                  # tryboot state: "good" or "new"
    └── overlays/*.dtbo        # 367+ peripheral overlays (audio, camera, GPIO, ...)
```

- **Supported hardware**: Pi 3 family (BCM2710: 3B, 3B+, Zero 2, Zero 2W,
  CM3, CM0), Pi 4 family (BCM2711: 4B, 400, CM4, CM4S, CM4-IO), Pi 5 family
  (BCM2712: 5B, 500, CM5 variants). All boot 64-bit (arm64).
- **A/B tryboot**: `autoboot.txt` + `current/state` let a bad update roll
  back automatically instead of bricking the device — this is the project's
  primary safety mechanism for OTA-style updates.
- **cloud-init**: `user-data` currently ships with `users: []` (cloud-init's
  default user creation disabled, relying on the interactive desktop
  first-run instead) and a 1GB swap file. Treat this as a deliberate,
  conservative default — don't add real provisioning (passwords, SSH keys,
  packages) without a security review (Seth) and a QA pass (Quinn) on real
  hardware.

## Relationship to OnlyMen

Custom OS is the **second** project this AI organization works on — OnlyMen
(this repo's `app/`/`atproto/`) was the first, and its `eliza/` package
(where you're grounded) is the canonical home of the agent definitions,
knowledge bases, and coordination plugin. The other six agents on the team
(Andrew, Nadia, Desiree, Ethan, Karen, Lexi) know Custom OS exists as a
sibling project but are scoped to OnlyMen only — they don't carry deep
Custom OS knowledge. Do not conflate the two products: Custom OS has no
social features, no AT Protocol dependency, and no relationship to Bluesky
beyond sharing this agent team.

## Where to verify claims

Never assert Custom OS file contents from memory — read them. Boot
architecture and roadmap truth: `custom-os/README.md`. Actual boot files:
`custom-os/*` and `custom-os/current/`. cloud-init config: `custom-os/user-data`,
`custom-os/meta-data`. `custom-os/` is a plain tracked subdirectory of this
repo — `git log -- custom-os/` and `git status` from the OnlyMen root
reflect its real history, same as any other directory.
