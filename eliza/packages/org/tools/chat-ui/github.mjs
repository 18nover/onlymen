/**
 * GitHub adapter for the engineering office.
 *
 * Every mutation is called only from an explicit approval route. The child
 * environment deliberately removes inherited token overrides so WSL's own
 * `gh auth login` keyring entry is authoritative.
 */
function safeEnvironment() {
  const environment = { ...process.env }
  delete environment.GH_TOKEN
  delete environment.GITHUB_TOKEN
  return environment
}

async function run(command, cwd) {
  const processHandle = Bun.spawn(command, {
    cwd,
    env: safeEnvironment(),
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(processHandle.stdout).text(),
    new Response(processHandle.stderr).text(),
    processHandle.exited,
  ])
  if (exitCode !== 0) {
    throw new Error(`${command[0]} failed (${exitCode}): ${stderr.trim()}`)
  }
  return stdout.trim()
}

function repositoryFromRemote(remote) {
  const match = remote.match(
    /github\.com[/:](?<owner>[^/]+)\/(?<repo>[^/]+?)(?:\.git)?$/,
  )
  if (!match?.groups) {
    throw new Error(`unsupported GitHub remote: ${remote}`)
  }
  return `${match.groups.owner}/${match.groups.repo}`
}

export async function githubStatus(repoRoot) {
  const remote = await run(['git', 'remote', 'get-url', 'origin'], repoRoot)
  const repository = repositoryFromRemote(remote)
  await run(['gh', 'auth', 'status', '--hostname', 'github.com'], repoRoot)
  return { repository, remote }
}

export async function createIssue(repoRoot, item) {
  const { repository } = await githubStatus(repoRoot)
  const body = [
    `OnlyMen engineering-office work item: \`${item.id}\``,
    '',
    item.description,
    '',
    '## Execution contract',
    '',
    `- Agent: \`${item.assignee}\``,
    `- Priority: \`${item.priority}\``,
    `- Base commit: \`${item.base_sha}\``,
    '- Editing and tests are approved only inside the isolated task worktree.',
    '- Commit, push, pull request, merge, deployment, and secrets require separate approval.',
    '',
    '<!-- onlymen-engineering-office -->',
  ].join('\n')
  const output = await run(
    [
      'gh',
      'api',
      `repos/${repository}/issues`,
      '--method',
      'POST',
      '--field',
      `title=${item.title}`,
      '--field',
      `body=${body}`,
    ],
    repoRoot,
  )
  const issue = JSON.parse(output)
  return { number: issue.number, url: issue.html_url }
}

export async function commentOnIssue(repoRoot, issueNumber, body) {
  const { repository } = await githubStatus(repoRoot)
  const output = await run(
    [
      'gh',
      'api',
      `repos/${repository}/issues/${issueNumber}/comments`,
      '--method',
      'POST',
      '--field',
      `body=${body}`,
    ],
    repoRoot,
  )
  return JSON.parse(output)
}

export async function createDraftPullRequest(repoRoot, item) {
  const { repository } = await githubStatus(repoRoot)
  const body = [
    `Implements OnlyMen engineering-office work item \`${item.id}\`.`,
    '',
    item.description,
    '',
    '## Review contract',
    '',
    '- Created deterministically after explicit publication approval.',
    '- This pull request is intentionally a draft.',
    '- Merge and deployment remain human-only actions.',
    item.issue_number ? `- Closes #${item.issue_number}` : null,
    '',
    '<!-- onlymen-engineering-office -->',
  ]
    .filter((line) => line !== null)
    .join('\n')
  const output = await run(
    [
      'gh',
      'api',
      `repos/${repository}/pulls`,
      '--method',
      'POST',
      '--field',
      `title=${item.title}`,
      '--field',
      `head=${item.branch}`,
      '--field',
      `base=${process.env.ONLYMEN_BASE_BRANCH ?? 'main'}`,
      '--field',
      `body=${body}`,
      '--field',
      'draft=true',
    ],
    repoRoot,
  )
  const pullRequest = JSON.parse(output)
  return { number: pullRequest.number, url: pullRequest.html_url }
}
