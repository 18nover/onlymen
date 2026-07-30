# OnlyMen Engineering Office

The engineering office is a local, approval-gated control plane for the 13
named elizaOS specialists in `eliza/packages/org/characters`. It is grounded in
this repository, not a generic collection of chatbot personas.

Andrew stays warm as the coordinator. Other specialists start on demand and
stop after an idle timeout. Conversations, work proposals, approvals,
execution metadata, and activity survive console restarts in:

```text
~/.local/state/onlymen/agents/engineering-office.sqlite
```

Generated agent runtime data and task worktrees live outside the repository:

```text
~/.local/state/onlymen/agents/
~/.local/share/onlymen/worktrees/
```

## Authority model

The workflow has explicit stages:

```text
proposal
  -> execution approval
  -> GitHub issue
  -> isolated Codex worktree (edit and test only)
  -> human review
  -> publication approval
  -> deterministic commit, push, and draft pull request
  -> human merge and deployment
```

GitHub issues and pull requests are the canonical shared work ledger. SQLite is
the recoverable local control-plane state.

Execution approval does not authorize commit, push, PR creation, merge,
deployment, network use, or secret access. The Codex executor runs with a
workspace-write sandbox, an ephemeral session, and a fixed prompt that
preserves AT Protocol compatibility.

Publication is a separate non-model operation. After explicit approval it
checks that the task worktree still has its original base commit, creates a
task branch, commits the reviewed files, pushes that branch, and opens a draft
PR. It never merges or deploys.

## Console

Start and open the office from either shell:

```text
om start agents
om open agents
```

The console at `http://localhost:4173` provides:

- persistent conversations with each named specialist;
- process status and on-demand start/stop controls;
- work proposals assigned to a specialist;
- execution and publication approval queues;
- isolated Codex execution controls;
- GitHub issue and draft PR links;
- a persistent activity trail.

The console listens only on `127.0.0.1`.

## Preconditions

Run `om auth` before approving work. Claude, Codex, and GitHub authentication
must exist inside WSL. The canonical checkout must have no tracked changes
before the executor creates a task worktree; this prevents current human work
from being silently copied into an agent task.

Run the focused office checks with:

```text
om verify org
```
