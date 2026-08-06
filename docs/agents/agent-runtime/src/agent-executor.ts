import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve } from 'path'
import { Agent } from './agents'
import { Message } from './task-queue'

export interface AgentExecutor {
  executeTask(
    agent: Agent,
    task: string,
    context: string,
    conversationHistory: Message[],
  ): Promise<string>
}

export function createAgentExecutor(apiKey: string, projectRoot: string): AgentExecutor {
  const client = new Anthropic()

  function getProjectContext(): string {
    // Scan project structure for context
    const scan = (dir: string, depth = 0, max = 3): string => {
      if (depth > max) return ''
      const entries = readdirSync(dir)
        .filter((e) => !e.startsWith('.'))
        .slice(0, 10)
      return entries
        .map((e) => {
          const path = resolve(dir, e)
          const stat = statSync(path)
          const indent = '  '.repeat(depth)
          return stat.isDirectory() ? `${indent}📁 ${e}/` : `${indent}📄 ${e}`
        })
        .join('\n')
    }
    
    return `Project Structure:\n${scan(projectRoot)}`
  }

  return {
    async executeTask(agent, task, context, conversationHistory) {
      const systemPrompt = `You are ${agent.name}, an AI engineer with the following role:

${agent.system}

You are speaking to a human through an admin control panel. Be direct, technical, and action-oriented.

Current Project Context:
${getProjectContext()}

Additional Context:
${context}

${agent.topics.length > 0 ? `Your expertise covers: ${agent.topics.join(', ')}` : ''}

Important: 
- You can read and modify project files when necessary
- You can request other agents to do work by mentioning their name
- Focus on actionable next steps
- Be concise but thorough
`

      const messages = [
        ...conversationHistory.map((m) => ({
          role: m.role === 'agent' ? ('assistant' as const) : ('user' as const),
          content: m.content,
        })),
        {
          role: 'user' as const,
          content: task,
        },
      ]

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      })

      return response.content[0].type === 'text' ? response.content[0].text : ''
    },
  }
}
