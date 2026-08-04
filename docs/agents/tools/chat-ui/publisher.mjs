/**
 * Deterministic publication stage for an approved worktree.
 *
 * This module contains no model calls. It may commit, push, and open a draft
 * pull request, but the server can call it only after a separate publication
 * approval has been recorded.
 */
import {
  commentOnIssue,
  createDraftPullRequest,
  githubStatus,
} from './github.mjs'

function safeEnvironment() {
  const environment = { ...process.env }
  delete environment.GH_TOKEN
  delete environment.GITHUB_TOKEN
  return environment
}

async function run(command, cwd, options = {}) {
  const child = Bun.spawn(command, {
    cwd,
    env: safeEnvironment(),
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  if (exitCode !== 0 && !options.allowFailure) {
    throw new Error(`${command[0]} failed (${exitCode}): ${stderr.trim()}`)
  }
  return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode }
}

function branchFor(item) {
  const suffix = item.issue_number ? `issue-${item.issue_number}` : item.id.toLowerCase()
  return `agent/${suffix}-${item.assignee}`
    .toLowerCase()
    .replaceAll(/[^a-z0-9/_-]/g, '-')
}

export async function publishWork({ item, controlPlane, repoRoot }) {
  if (!controlPlane.approved(item.id, 'publication')) {
    throw new Error('publication is not approved')
  }
  if (!item.worktree_path) throw new Error('work item has no execution worktree')
  if (!['review', 'ready_for_human'].includes(item.status)) {
    throw new Error(`work item is not ready for publication: ${item.status}`)
  }

  const worktree = item.worktree_path
  const head = (await run(['git', 'rev-parse', 'HEAD'], worktree)).stdout
  if (head !== item.base_sha) {
    throw new Error('task worktree HEAD changed before deterministic publication')
  }
  const changes = (await run(['git', 'status', '--porcelain=v1'], worktree)).stdout
  if (!changes) throw new Error('task worktree has no changes to publish')

  // Fail before changing Git state if WSL-native GitHub authentication or the
  // canonical repository mapping is unavailable.
  await githubStatus(repoRoot)

  const branch = branchFor(item)
  const branchExists = await run(
    ['git', 'show-ref', '--verify', '--quiet', `refs/heads/${branch}`],
    repoRoot,
    { allowFailure: true },
  )
  if (branchExists.exitCode === 0) {
    throw new Error(`local publication branch already exists: ${branch}`)
  }

  await run(['git', 'switch', '--create', branch], worktree)
  await run(['git', 'add', '--all'], worktree)
  const commitMessage = item.issue_number
    ? `${item.title} (#${item.issue_number})`
    : item.title
  await run(['git', 'commit', '--message', commitMessage], worktree)
  await run(['git', 'push', '--set-upstream', 'origin', branch], worktree)

  const pullRequest = await createDraftPullRequest(repoRoot, {
    ...item,
    branch,
  })
  const updated = controlPlane.updateWork(item.id, {
    status: 'ready_for_human',
    branchName: branch,
    pullRequestUrl: pullRequest.url,
  })
  controlPlane.activity('publication.completed', `Draft PR opened for ${item.id}`, {
    workItemId: item.id,
    agentId: item.assignee,
    details: { branch, pullRequestUrl: pullRequest.url },
  })
  if (item.issue_number) {
    try {
      await commentOnIssue(
        repoRoot,
        item.issue_number,
        `Draft pull request opened after publication approval: ${pullRequest.url}`,
      )
    } catch (error) {
      controlPlane.activity(
        'publication.comment_failed',
        error instanceof Error ? error.message : String(error),
        {
          workItemId: item.id,
          agentId: item.assignee,
          details: { pullRequestUrl: pullRequest.url },
        },
      )
    }
  }
  return { item: updated, branch, pullRequestUrl: pullRequest.url }
}
