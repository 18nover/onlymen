import { afterEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { openControlPlane } from './control-plane.mjs'
import { publishWork } from './publisher.mjs'

const temporaryRoots = []

function temporaryRoot() {
  const root = mkdtempSync(join(tmpdir(), 'onlymen-office-'))
  temporaryRoots.push(root)
  return root
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

describe('engineering office control plane', () => {
  test('persists work, approvals, and messages across restarts', () => {
    const root = temporaryRoot()
    const first = openControlPlane(root)
    const { item, approval } = first.createWork({
      title: 'Keep AT Protocol contracts stable',
      description: 'Audit product branding without changing app.bsky lexicons.',
      assignee: 'andrew',
      priority: 'high',
      baseSha: 'abc123',
    })
    first.saveMessage('andrew', 'user', 'Give me the current risk summary.')
    first.decideApproval(approval.id, 'approved', 'Scoped edit and test approved.')
    first.updateWork(item.id, {
      status: 'approved',
      issueNumber: 42,
      issueUrl: 'https://github.com/example/onlymen/issues/42',
    })
    first.close()

    const second = openControlPlane(root)
    expect(second.getWork(item.id)).toMatchObject({
      status: 'approved',
      issue_number: 42,
    })
    expect(second.approved(item.id, 'execution')).toMatchObject({
      status: 'approved',
      note: 'Scoped edit and test approved.',
    })
    expect(second.messages('andrew')).toHaveLength(1)
    expect(second.recentActivity().length).toBeGreaterThan(0)
    second.close()
  })

  test('keeps publication separate from execution approval', () => {
    const controlPlane = openControlPlane(temporaryRoot())
    const { item, approval } = controlPlane.createWork({
      title: 'Add a focused test',
      description: 'Edit and test only.',
      assignee: 'desiree',
      priority: 'medium',
      baseSha: 'def456',
    })
    controlPlane.decideApproval(approval.id, 'approved')
    expect(controlPlane.approved(item.id, 'publication')).toBeNull()

    const publication = controlPlane.requestApproval(item.id, 'publication')
    expect(publication.kind).toBe('publication')
    expect(publication.status).toBe('pending')
    expect(controlPlane.approved(item.id, 'publication')).toBeNull()
    controlPlane.close()
  })

  test('publisher refuses work without a separate publication approval', async () => {
    const controlPlane = openControlPlane(temporaryRoot())
    const { item } = controlPlane.createWork({
      title: 'Do not publish this yet',
      description: 'Publication is intentionally unapproved.',
      assignee: 'seth',
      priority: 'critical',
      baseSha: 'abc123',
    })

    await expect(
      publishWork({
        item: { ...item, status: 'review', worktree_path: '/tmp/not-used' },
        controlPlane,
        repoRoot: '/tmp/not-used',
      }),
    ).rejects.toThrow('publication is not approved')
    controlPlane.close()
  })
})
