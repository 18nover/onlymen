import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const charactersDir = resolve(__dirname, '..', '..', 'characters')

export interface Agent {
  name: string
  username: string
  role: string
  bio: string[]
  system: string
  topics: string[]
  adjectives: string[]
  style: Record<string, string[]>
  messageExamples: Array<Array<{ name: string; content: { text: string } }>>
  knowledge: Array<{ path: string; title: string }>
  settings: Record<string, string | boolean>
}

export function loadAgents(): Agent[] {
  const files = readdirSync(charactersDir).filter((f) => f.endsWith('.json'))
  return files.map((f) => {
    const content = readFileSync(resolve(charactersDir, f), 'utf-8')
    return JSON.parse(content) as Agent
  })
}

export function loadAgent(name: string): Agent {
  const path = resolve(charactersDir, `${name}.json`)
  const content = readFileSync(path, 'utf-8')
  return JSON.parse(content)
}

export function getAgentRole(agent: Agent): string {
  return agent.settings.ORG_ROLE as string
}
