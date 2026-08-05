#!/usr/bin/env node
/**
 * `agents` — list, regenerate, and validate the archived OnlyMen AI org
 * roster at docs/agents/. This is a plain reimplementation of the useful
 * parts of the old eliza-era `org` CLI and its scripts/*.ts generators:
 * the server-lifecycle, chat, and board commands are gone because they
 * depended on the elizaOS runtime that was removed with eliza/ - there is
 * nothing left for them to talk to. No Bun, no @elizaos/core.
 *
 * Usage:
 *   node bin/agents.ts list                list the 13 archived agents
 *   node bin/agents.ts docs                 regenerate docs/agents/<slug>.md
 *   node bin/agents.ts validate             check characters/*.json structure
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const agentsRoot = join(repoRoot, 'docs', 'agents')
const charactersDir = join(agentsRoot, 'characters')
const knowledgeDir = join(agentsRoot, 'knowledge')

interface CharacterFile {
  name: string
  username: string
  bio: string[]
  topics: string[]
  settings: Record<string, string>
  knowledge: Array<{ path: string; title: string }>
}

/** Per-agent metadata the character file doesn't carry: which skill playbook and review category. */
const AGENT_META: Record<string, { skills: string[]; reviewType: string }> = {
  andrew: { skills: ['architecture-review'], reviewType: 'architecture_review' },
  audrey: { skills: ['code-audit'], reviewType: 'code_review' },
  desiree: { skills: ['accessibility-review'], reviewType: 'design_review' },
  devon: { skills: ['devops-deployment'], reviewType: 'code_review' },
  ethan: { skills: ['accessibility-review'], reviewType: 'accessibility_review' },
  karen: { skills: ['moderation-tooling'], reviewType: 'code_review' },
  lexi: { skills: ['lexicon-design'], reviewType: 'architecture_review' },
  morgan: { skills: ['backend-dev'], reviewType: 'code_review' },
  nadia: { skills: ['react-native-dev', 'expo-dev'], reviewType: 'code_review' },
  parker: { skills: ['performance-review'], reviewType: 'code_review' },
  penelope: { skills: ['technical-writing'], reviewType: 'code_review' },
  quinn: { skills: ['qa-testing'], reviewType: 'qa_review' },
  seth: { skills: ['security-audit'], reviewType: 'security_review' },
}

function fail(message: string): never {
  console.error(`agents: ${message}`)
  process.exit(1)
}

function agentSlugs(): string[] {
  if (!existsSync(charactersDir)) fail(`no characters directory at ${charactersDir}`)
  return readdirSync(charactersDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort()
}

function loadCharacter(slug: string): CharacterFile {
  return JSON.parse(readFileSync(join(charactersDir, `${slug}.json`), 'utf8')) as CharacterFile
}

function list(): void {
  for (const slug of agentSlugs()) {
    const character = loadCharacter(slug)
    const role = character.settings?.ORG_ROLE ?? 'unknown'
    console.log(`${slug}\t${character.name}\t${role}`)
  }
}

function docs(): void {
  const slugs = agentSlugs()
  for (const slug of slugs) {
    const character = loadCharacter(slug)
    const meta = AGENT_META[slug]
    if (!meta) fail(`AGENT_META has no entry for "${slug}" — add one so the doc can be generated`)

    const role = character.settings?.ORG_ROLE ?? 'unknown'
    const permissions = Object.entries(character.settings ?? {})
      .filter(([k, v]) => k.startsWith('ORG_CAN_') && v === 'true')
      .map(([k]) => k.replace('ORG_CAN_', '').toLowerCase().replace(/_/g, ' '))

    const doc = `# ${character.name} — \`${slug}\`

> ${character.bio[0]}

| | |
|---|---|
| **Username** | \`${character.username}\` |
| **Role** | \`${role}\` |
| **Org permissions** | ${permissions.length > 0 ? permissions.join(', ') : '—'} |
| **Skills** | ${meta.skills.map((s) => `[\`${s}\`](skills/${s}/SKILL.md)`).join(', ')} |
| **Review type** | \`${meta.reviewType}\` |

${character.bio.slice(1).map((line) => `- ${line}`).join('\n')}

**Expertise:** ${character.topics.join(', ')}

## Knowledge base

${character.knowledge.map((k) => `- [${k.title}](${k.path.replace(/^\.\.\//, '')})`).join('\n')}
`
    writeFileSync(join(agentsRoot, `${slug}.md`), doc)
    console.log(`ok docs/agents/${slug}.md`)
  }
  console.log(`${slugs.length} agent docs regenerated (README.md is hand-maintained, not touched)`)
}

function validate(): void {
  const slugs = agentSlugs()
  if (slugs.length === 0) fail(`no character files found in ${charactersDir}`)

  let failures = 0
  for (const slug of slugs) {
    const file = `${slug}.json`
    try {
      const character = loadCharacter(slug)
      if (typeof character.name !== 'string' || character.name.length === 0) {
        throw new Error('missing character name')
      }
      if (!(character as unknown as { system?: string }).system) {
        throw new Error('missing system prompt')
      }
      if (!Array.isArray(character.bio) || character.bio.length === 0) {
        throw new Error('missing bio')
      }
      if (!Array.isArray(character.topics) || character.topics.length === 0) {
        throw new Error('missing topics')
      }
      const hasKnowledgeDir = statSync(join(knowledgeDir, slug), { throwIfNoEntry: false })?.isDirectory()
      if (!hasKnowledgeDir) console.warn(`  warn ${file}: no knowledge dir`)

      for (const k of character.knowledge ?? []) {
        const resolved = join(charactersDir, k.path)
        if (!existsSync(resolved)) throw new Error(`knowledge reference does not exist: ${k.path}`)
      }
      if (!AGENT_META[slug]) console.warn(`  warn ${file}: no AGENT_META entry (docs regeneration will fail)`)

      console.log(`ok ${character.name} (${file})`)
    } catch (error) {
      failures += 1
      console.error(`FAIL ${file}:`, error instanceof Error ? error.message : error)
    }
  }

  if (failures > 0) fail(`${failures}/${slugs.length} character files invalid`)
  console.log(`${slugs.length} characters valid`)
}

const [command] = process.argv.slice(2)
switch (command) {
  case 'list':
    list()
    break
  case 'docs':
    docs()
    break
  case 'validate':
    validate()
    break
  default: {
    const source = readFileSync(fileURLToPath(import.meta.url), 'utf8')
    const usage = source.split('\n').filter((l) => l.startsWith(' * ')).map((l) => l.slice(3))
    console.log(usage.join('\n'))
    if (command && command !== 'help') process.exit(1)
  }
}
