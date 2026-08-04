/**
 * Durable local control plane for the OnlyMen engineering office.
 *
 * GitHub remains the canonical work ledger. This SQLite database stores the
 * local draft, approval, process, conversation, and execution metadata needed
 * to make the localhost console recover cleanly after a restart.
 */
import { Database } from 'bun:sqlite'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const WORK_STATUSES = new Set([
  'proposed',
  'approved',
  'working',
  'review',
  'ready_for_human',
  'closed',
  'failed',
  'cancelled',
])
const APPROVAL_KINDS = new Set(['execution', 'publication'])

function now() {
  return new Date().toISOString()
}

function workId() {
  return `WORK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

function approvalId() {
  return `APPROVAL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

export function openControlPlane(stateRoot) {
  mkdirSync(stateRoot, { recursive: true })
  const database = new Database(join(stateRoot, 'engineering-office.sqlite'), {
    create: true,
    strict: true,
  })
  database.run('PRAGMA journal_mode = WAL')
  database.run('PRAGMA foreign_keys = ON')
  database.run(`
    CREATE TABLE IF NOT EXISTS work_items (
      id TEXT PRIMARY KEY,
      issue_number INTEGER,
      issue_url TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      assignee TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      base_sha TEXT NOT NULL,
      worktree_path TEXT,
      branch_name TEXT,
      pull_request_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)
  const workItemColumns = new Set(
    database
      .query('PRAGMA table_info(work_items)')
      .all()
      .map((column) => column.name),
  )
  if (!workItemColumns.has('branch_name')) {
    database.run('ALTER TABLE work_items ADD COLUMN branch_name TEXT')
  }
  if (!workItemColumns.has('pull_request_url')) {
    database.run('ALTER TABLE work_items ADD COLUMN pull_request_url TEXT')
  }
  database.run(`
    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      work_item_id TEXT NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      status TEXT NOT NULL,
      requested_at TEXT NOT NULL,
      decided_at TEXT,
      note TEXT
    )
  `)
  database.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id TEXT NOT NULL,
      role TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)
  database.run(`
    CREATE TABLE IF NOT EXISTS activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      work_item_id TEXT,
      agent_id TEXT,
      summary TEXT NOT NULL,
      details_json TEXT,
      created_at TEXT NOT NULL
    )
  `)
  database.run(`
    CREATE TABLE IF NOT EXISTS execution_runs (
      id TEXT PRIMARY KEY,
      work_item_id TEXT NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      worktree_path TEXT NOT NULL,
      base_sha TEXT NOT NULL,
      final_sha TEXT,
      changed_files_json TEXT,
      test_summary TEXT,
      final_message TEXT,
      error TEXT,
      started_at TEXT NOT NULL,
      completed_at TEXT
    )
  `)

  const insertWork = database.prepare(`
    INSERT INTO work_items (
      id, title, description, assignee, priority, status, base_sha, created_at, updated_at
    ) VALUES ($id, $title, $description, $assignee, $priority, 'proposed', $baseSha, $now, $now)
    RETURNING *
  `)
  const insertApproval = database.prepare(`
    INSERT INTO approvals (
      id, work_item_id, kind, status, requested_at
    ) VALUES ($id, $workItemId, $kind, 'pending', $now)
    RETURNING *
  `)
  const insertActivity = database.prepare(`
    INSERT INTO activity (
      type, work_item_id, agent_id, summary, details_json, created_at
    ) VALUES ($type, $workItemId, $agentId, $summary, $detailsJson, $now)
  `)

  function activity(type, summary, options = {}) {
    insertActivity.run({
      type,
      workItemId: options.workItemId ?? null,
      agentId: options.agentId ?? null,
      summary,
      detailsJson: options.details ? JSON.stringify(options.details) : null,
      now: now(),
    })
  }

  function createWork(input) {
    const timestamp = now()
    const item = insertWork.get({
      id: workId(),
      title: input.title,
      description: input.description,
      assignee: input.assignee,
      priority: input.priority,
      baseSha: input.baseSha,
      now: timestamp,
    })
    const approval = insertApproval.get({
      id: approvalId(),
      workItemId: item.id,
      kind: 'execution',
      now: timestamp,
    })
    activity('work.proposed', `Proposed ${item.id}: ${item.title}`, {
      workItemId: item.id,
      agentId: item.assignee,
    })
    return { item, approval }
  }

  function listWork() {
    return database
      .query(
        `SELECT w.*,
          (SELECT status FROM approvals
            WHERE work_item_id = w.id AND kind = 'execution'
            ORDER BY requested_at DESC LIMIT 1) AS execution_approval,
          (SELECT status FROM approvals
            WHERE work_item_id = w.id AND kind = 'publication'
            ORDER BY requested_at DESC LIMIT 1) AS publication_approval
        FROM work_items w
        ORDER BY w.updated_at DESC`,
      )
      .all()
  }

  function getWork(id) {
    return database.query('SELECT * FROM work_items WHERE id = ?').get(id)
  }

  function updateWork(id, changes) {
    const current = getWork(id)
    if (!current) return null
    const status = changes.status ?? current.status
    if (!WORK_STATUSES.has(status)) {
      throw new Error(`invalid work status: ${status}`)
    }
    database
      .prepare(`
        UPDATE work_items SET
          issue_number = $issueNumber,
          issue_url = $issueUrl,
          status = $status,
          worktree_path = $worktreePath,
          branch_name = $branchName,
          pull_request_url = $pullRequestUrl,
          updated_at = $now
        WHERE id = $id
      `)
      .run({
        id,
        issueNumber: changes.issueNumber ?? current.issue_number,
        issueUrl: changes.issueUrl ?? current.issue_url,
        status,
        worktreePath: changes.worktreePath ?? current.worktree_path,
        branchName: changes.branchName ?? current.branch_name,
        pullRequestUrl: changes.pullRequestUrl ?? current.pull_request_url,
        now: now(),
      })
    activity('work.updated', `${id} is ${status}`, {
      workItemId: id,
      agentId: current.assignee,
    })
    return getWork(id)
  }

  function decideApproval(id, decision, note) {
    if (!['approved', 'rejected'].includes(decision)) {
      throw new Error(`invalid approval decision: ${decision}`)
    }
    const approval = database.query('SELECT * FROM approvals WHERE id = ?').get(id)
    if (!approval) return null
    if (!APPROVAL_KINDS.has(approval.kind)) {
      throw new Error(`invalid approval kind: ${approval.kind}`)
    }
    database
      .prepare(`
        UPDATE approvals SET status = ?, decided_at = ?, note = ?
        WHERE id = ? AND status = 'pending'
      `)
      .run(decision, now(), note ?? null, id)
    activity(
      'approval.decided',
      `${approval.kind} ${decision} for ${approval.work_item_id}`,
      { workItemId: approval.work_item_id },
    )
    return database.query('SELECT * FROM approvals WHERE id = ?').get(id)
  }

  function requestApproval(workItemId, kind) {
    if (!APPROVAL_KINDS.has(kind)) throw new Error(`invalid approval kind: ${kind}`)
    const existing = database
      .query(
        `SELECT * FROM approvals
         WHERE work_item_id = ? AND kind = ? AND status = 'pending'
         ORDER BY requested_at DESC LIMIT 1`,
      )
      .get(workItemId, kind)
    if (existing) return existing
    const approval = insertApproval.get({
      id: approvalId(),
      workItemId,
      kind,
      now: now(),
    })
    activity('approval.requested', `${kind} approval requested for ${workItemId}`, {
      workItemId,
    })
    return approval
  }

  function listApprovals() {
    return database
      .query(`
        SELECT a.*, w.title, w.assignee
        FROM approvals a JOIN work_items w ON w.id = a.work_item_id
        ORDER BY a.requested_at DESC
      `)
      .all()
  }

  function approved(workItemId, kind) {
    if (!APPROVAL_KINDS.has(kind)) throw new Error(`invalid approval kind: ${kind}`)
    return database
      .query(
        `SELECT * FROM approvals
         WHERE work_item_id = ? AND kind = ? AND status = 'approved'
         ORDER BY requested_at DESC LIMIT 1`,
      )
      .get(workItemId, kind)
  }

  function saveMessage(agentId, role, text) {
    database
      .prepare(
        'INSERT INTO messages (agent_id, role, text, created_at) VALUES (?, ?, ?, ?)',
      )
      .run(agentId, role, text, now())
  }

  function messages(agentId) {
    return database
      .query(
        'SELECT role, text, created_at FROM messages WHERE agent_id = ? ORDER BY id ASC',
      )
      .all(agentId)
  }

  function recentActivity(limit = 100) {
    return database
      .query('SELECT * FROM activity ORDER BY id DESC LIMIT ?')
      .all(Math.min(Math.max(limit, 1), 500))
      .map((entry) => ({
        ...entry,
        details: entry.details_json ? JSON.parse(entry.details_json) : null,
      }))
  }

  function close() {
    database.close()
  }

  return {
    database,
    createWork,
    listWork,
    getWork,
    updateWork,
    decideApproval,
    requestApproval,
    listApprovals,
    approved,
    saveMessage,
    messages,
    recentActivity,
    activity,
    close,
  }
}
