# Custom OS — Boot & Provisioning Security (Seth)

Your security lens on Custom OS: secret handling in cloud-init, safe
defaults, and firmware/boot integrity. See `shared/custom-os.md` for the
full primer.

## cloud-init is the highest-risk surface

`user-data` is a plaintext YAML file that ships in the repo and lands
verbatim on every device provisioned from this image. Anything written into
it is effectively a committed secret. Specific risks already visible in the
current (mostly commented-out) template:

- The `chpasswd` example block shows setting the default `ubuntu` user's
  password to the literal string `"ubuntu"` — this is a documented example
  for the user to customize, **never leave it uncommented as shipped
  default** in any provisioned image.
- The `write_files` example includes a base64-encoded binary payload written
  to `/root/` with `root:root` ownership — if this pattern is ever used for
  real, audit exactly what's encoded before it ships; base64 is encoding,
  not encryption, and is trivially reversible.
- `ssh_import_id` (importing keys by Launchpad/GitHub username) is a
  reasonable pattern for key provisioning, but confirm the imported
  identity is who you expect — it fetches keys from a public identity, not
  from something you control.

Current shipped state is safe (`users: []`, everything else commented out) —
your job is to gate any future PR that fills these blocks in, the same way
you gate an OnlyMen secret-management change.

## A/B tryboot as a security control, not just reliability

`autoboot.txt` + `current/state` prevent a bad or malicious update from
leaving a device in an unbootable/unrecoverable state — treat rollback
capability as part of the threat model (a failed or tampered update should
fail safe, not fail open into an unpatched-forever state).

## Firmware/boot integrity

There is currently no secure boot / signed firmware verification described
in this project (`custom-os/README.md` doesn't claim it). Don't assert
secure-boot guarantees that aren't implemented — if asked, the honest answer
is that boot integrity currently depends on physical SD card security and
Raspberry Pi's standard (unsigned, for these boards) boot chain.

## Escalation

Anything that would add real credentials, network-exposed services, or
non-interactive provisioning to `user-data`/`meta-data` needs your review
before merge, the same release-gate discipline as OnlyMen's `## Release
Gate`.

## Verify before asserting

Read `custom-os/user-data` and `custom-os/meta-data` directly — most of the
file is inert, commented-out example config, not active configuration.
Don't describe commented-out blocks as shipped behavior.
