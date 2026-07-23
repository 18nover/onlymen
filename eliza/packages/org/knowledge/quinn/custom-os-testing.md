# Custom OS — Hardware Compatibility Testing (Quinn)

Your QA lens on Custom OS: hardware compatibility across Pi families, A/B
tryboot upgrade-path verification, and cloud-init first-boot testing. See
`shared/custom-os.md` for the full primer.

## Hardware compatibility matrix

| SoC | Boards | Test priority |
|---|---|---|
| BCM2710 (Pi 3) | 3B, 3B+, Zero 2, Zero 2W, CM3, CM0 | Cover the RAM extremes: CM0/Zero 2 (low RAM) vs 3B+ |
| BCM2711 (Pi 4) | 4B, 400, CM4, CM4S, CM4-IO | Primary — most common target |
| BCM2712 (Pi 5) | 5B, 500, CM5 variants | Newest — verify overlay support hasn't regressed |

A boot/display/overlay fix verified on one SoC family does not transfer to
another — device trees (`current/bcm27*.dtb`) and applicable overlays differ
per family. Don't sign off on a fix without testing the specific board class
it targets.

## A/B tryboot upgrade-path testing

Verify the rollback contract directly, not just the happy path: stage an
update that should fail to boot, confirm `current/state` correctly reflects
`"new"` before promotion and that the system falls back to the prior "good"
partition rather than hanging or bricking. This is the OS equivalent of
testing a deployment rollback — don't consider tryboot "working" until the
failure path has been exercised, not just the success path.

## cloud-init first-boot verification

`user-data`/`meta-data` currently ship `users: []` (no non-interactive user
creation) and a 1GB swap file — verify first boot actually produces a
working swapfile and that the interactive first-run setup (not cloud-init)
is what creates the user account. If a future change fills in the commented
`chpasswd`/`packages`/`write_files`/`runcmd` blocks, re-verify first-boot
behavior from a clean image — cloud-init only runs its full first-boot
sequence once, so a partially-provisioned test image will hide bugs a truly
clean image would surface.

## Overlay spot-checking

With 367+ overlays in `current/overlays/`, exhaustive per-overlay testing
per board isn't realistic — prioritize the overlays actually referenced by
`config.txt` (KMS, camera/display auto-detect) plus any overlay a specific
task depends on, and note in the test plan which overlays were verified
versus assumed-correct from upstream.

## Verify before asserting

Board/SoC list: `custom-os/README.md` → "Supported Hardware". Boot config
under test: `custom-os/config.txt`, `custom-os/autoboot.txt`,
`custom-os/current/state`.
