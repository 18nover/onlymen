# Custom OS — Boot & Runtime Performance (Parker)

Your performance lens on Custom OS: boot time, memory footprint, and
graphics/I/O behavior across genuinely different hardware tiers. See
`shared/custom-os.md` for the full primer.

## Hardware tiers are not interchangeable

Pi 3 (BCM2710), Pi 4 (BCM2711), and Pi 5 (BCM2712) span roughly a decade of
SoC generations — a performance budget that's reasonable on Pi 5 (4-8GB RAM,
faster storage I/O) may be unusable on a Pi Zero 2 W or CM0 (the low end of
the Pi 3 family, as little as 512MB RAM). Always state which hardware class
a performance claim applies to; "boots in N seconds" is meaningless without
naming the board.

## Boot time

Cold boot time is a function of: first-stage bootloader (Pi 3 only, via
`bootcode.bin`) → GPU firmware (`start*.elf`/`fixup*.dat`) → kernel + initrd
(`current/vmlinuz`, `current/initrd.img`) → device tree + overlay parsing
(`current/bcm27*.dtb`, `current/overlays/*.dtbo`) → cloud-init first-boot
provisioning (one-time cost, only on first boot). Loading more overlays than
a given board needs adds parse time for no benefit — `config.txt`'s overlay
selection should stay scoped to the hardware actually present.

## Graphics and KMS

`vc4-kms-v3d` (full KMS/kernel modesetting) is the shipped graphics path —
it has different performance characteristics than the legacy firmware-KMS
path (different latency/compositor behavior). If a workload cares about
display latency, profile against the actual overlay in use, not a generic
"Raspberry Pi graphics" assumption.

## Memory and swap sizing

`user-data` provisions a 1GB swap file by default. On RAM-constrained boards,
swap smooths over memory pressure at the cost of SD-card write amplification
and latency spikes when swap activates — this is a real trade-off to profile
per hardware tier, not a value to treat as universally correct. Cross-check
sizing decisions with Morgan (`custom-os-system-services.md`) before
recommending a change.

## Verify before asserting

Hardware tier list and SoC names: `custom-os/README.md` → "Supported
Hardware" table. Overlay inventory (for parse-time claims):
`custom-os/current/overlays/` (367+ files as of this grounding — recount
before citing an exact figure, it will drift).
