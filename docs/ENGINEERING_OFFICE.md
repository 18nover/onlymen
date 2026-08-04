# OnlyMen Engineering Office (archived)

The engineering office was a local, approval-gated control plane for the 13
named elizaOS specialists that used to live in `eliza/packages/org/`. That
framework has been removed while other options for running these agents are
evaluated.

The agent definitions, per-agent knowledge base, shared engineering
standards, and skill playbooks are preserved at
[`docs/agents/`](agents/README.md). The console, `om start agents` /
`om open agents` / `om verify org` commands, and the approval-gated
proposal → execution → publication workflow described by the old version of
this document no longer exist — `bin/om` and the root `Makefile` were
stripped of that integration when `eliza/` was removed.
