/**
 * Approval-gated Codex executor for OnlyMen task worktrees.
 *
 * The executor refuses a dirty canonical checkout, creates a detached sibling
 * worktree, runs Codex with workspace-only permissions, and proves afterward
 * that the task did not commit or move HEAD. Publishing is intentionally not
 * part of this module.
 */
import { mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

async function run(command, cwd, options = {}) {
  const processHandle = Bun.spawn(command, {
    cwd,
    env: options.env ?? process.env,
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(processHandle.stdout).text(),
    new Response(processHandle.stderr).text(),
    processHandle.exited,
  ])
  if (exitCode !== 0 && !options.allowFailure) {
    throw new Error(`${command[0]} failed (${exitCode}): ${stderr.trim()}`)
  }
  return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode }
}

function safeTaskSlug(item) {
  const issue = item.issue_number ? `issue-${item.issue_number}` : item.id.toLowerCase()
  return `${issue}-${item.assignee}`.replace(/[^a-z0-9-]/g, '-')
}

function executorPrompt(item) {
  return [
    `You are executing approved OnlyMen work item ${item.id} as the ${item.assignee} specialist.`,
    '',
    `Title: ${item.title}`,
    `Description: ${item.description}`,
    `Base commit: ${item.base_sha}`,
    '',
    'Execution boundary:',
    '- Inspect the repository and implement only this approved task.',
    '- You may edit files only inside this worktree and run relevant local tests.',
    '- Do not commit, push, fetch, pull, open a PR, merge, deploy, access secrets, or use the network.',
    '- Do not rewrite unrelated files or generated artifacts unless the task explicitly requires them.',
    '- Preserve AT Protocol compatibility. Product branding does not authorize renaming app.bsky.* contracts.',
    '- Finish with changed files, tests run, test results, remaining risks, and reviewer recommendations.',
  ].join('\n')
}

export async function executeWork({
  item,
  controlPlane,
  repoRoot,
  worktreeRoot,
  onEvent,
}) {
  const dirty = await run(['git', 'status', '--porcelain', '--untracked-files=no'], repoRoot)
  if (dirty.stdout) {
    throw new Error(
      'The canonical checkout has tracked changes. Reconcile or commit them before creating an executor worktree.',
    )
  }

  const currentBase = await run(['git', 'rev-parse', item.base_sha], repoRoot)
  if (currentBase.stdout !== item.base_sha) {
    throw new Error(`base commit ${item.base_sha} is unavailable`)
  }

  mkdirSync(worktreeRoot, { recursive: true })
  const root = resolve(worktreeRoot)
  const worktreePath = resolve(join(root, safeTaskSlug(item)))
  if (!worktreePath.startsWith(`${root}/`) && worktreePath !== root) {
    throw new Error('resolved worktree path escaped the configured worktree root')
  }

  const existing = await run(
    ['git', 'worktree', 'list', '--porcelain'],
    repoRoot,
  )
  if (!existing.stdout.includes(`worktree ${worktreePath}`)) {
    await run(
      ['git', 'worktree', 'add', '--detach', worktreePath, item.base_sha],
      repoRoot,
    )
  }

  const runId = `RUN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const startedAt = new Date().toISOString()
  controlPlane.database
    .prepare(`
      INSERT INTO execution_runs (
        id, work_item_id, status, worktree_path, base_sha, started_at
      ) VALUES (?, ?, 'running', ?, ?, ?)
    `)
    .run(runId, item.id, worktreePath, item.base_sha, startedAt)
  controlPlane.updateWork(item.id, {
    status: 'working',
    worktreePath,
  })
  controlPlane.activity('execution.started', `${runId} started for ${item.id}`, {
    workItemId: item.id,
    agentId: item.assignee,
  })

  const command = [
    'codex',
    'exec',
    '--json',
    '--ephemeral',
    '--ignore-user-config',
    '--config',
    'approval_policy="never"',
    '--sandbox',
    'workspace-write',
    '-C',
    worktreePath,
    executorPrompt(item),
  ]
  const processHandle = Bun.spawn(command, {
    cwd: worktreePath,
    env: {
      ...process.env,
      ONLYMEN_EXECUTION_ID: runId,
      ONLYMEN_WORK_ITEM_ID: item.id,
    },
    stdout: 'pipe',
    stderr: 'pipe',
  })

  let finalMessage = ''
  const reader = processHandle.stdout.getReader()
  const decoder = new TextDecoder()
  let pending = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    pending += decoder.decode(value, { stream: true })
    const lines = pending.split('\n')
    pending = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const event = JSON.parse(line)
        onEvent?.(event)
        if (
          event.type === 'item.completed' &&
          event.item?.type === 'agent_message'
        ) {
          finalMessage = event.item.text
        }
      } catch {
        onEvent?.({ type: 'executor.output', text: line })
      }
    }
  }
  const stderr = await new Response(processHandle.stderr).text()
  const exitCode = await processHandle.exited

  const finalSha = (await run(['git', 'rev-parse', 'HEAD'], worktreePath)).stdout
  const status = await run(
    ['git', 'status', '--porcelain=v1', '--untracked-files=normal'],
    worktreePath,
  )
  const changedFiles = status.stdout
    ? status.stdout.split('\n').map((line) => line.slice(3))
    : []
  const completedAt = new Date().toISOString()
  const headMoved = finalSha !== item.base_sha
  const error =
    exitCode !== 0
      ? `Codex exited with ${exitCode}: ${stderr.trim()}`
      : headMoved
        ? `Executor changed HEAD from ${item.base_sha} to ${finalSha}; publication is blocked.`
        : null
  const runStatus = error ? 'failed' : 'completed'

  controlPlane.database
    .prepare(`
      UPDATE execution_runs SET
        status = ?, final_sha = ?, changed_files_json = ?,
        final_message = ?, error = ?, completed_at = ?
      WHERE id = ?
    `)
    .run(
      runStatus,
      finalSha,
      JSON.stringify(changedFiles),
      finalMessage,
      error,
      completedAt,
      runId,
    )
  controlPlane.updateWork(item.id, {
    status: error ? 'failed' : 'review',
    worktreePath,
  })
  controlPlane.activity(
    error ? 'execution.failed' : 'execution.completed',
    error ?? `${runId} completed with ${changedFiles.length} changed file(s)`,
    { workItemId: item.id, agentId: item.assignee, details: { changedFiles } },
  )

  return {
    id: runId,
    status: runStatus,
    worktreePath,
    baseSha: item.base_sha,
    finalSha,
    changedFiles,
    finalMessage,
    error,
  }
}
