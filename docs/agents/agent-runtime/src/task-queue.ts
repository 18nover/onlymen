import { v4 as uuidv4 } from 'uuid'

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'review' | 'blocked' | 'done' | 'cancelled'
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  description: string
  assignee: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: Date
  updatedAt: Date
  deadline?: Date
  completedAt?: Date
  error?: string
}

export interface Message {
  id: string
  taskId: string
  agentName: string
  role: 'agent' | 'user' | 'system'
  content: string
  timestamp: Date
}

export interface TaskQueue {
  tasks: Map<string, Task>
  messages: Map<string, Message[]>
  
  createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task
  getTask(id: string): Task | undefined
  updateTask(id: string, updates: Partial<Task>): Task
  listTasks(filter?: { assignee?: string; status?: TaskStatus }): Task[]
  
  addMessage(taskId: string, message: Omit<Message, 'id' | 'timestamp'>): Message
  getMessages(taskId: string): Message[]
}

export function createTaskQueue(): TaskQueue {
  const tasks = new Map<string, Task>()
  const messages = new Map<string, Message[]>()

  return {
    tasks,
    messages,
    
    createTask(data) {
      const now = new Date()
      const task: Task = {
        ...data,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      }
      tasks.set(task.id, task)
      messages.set(task.id, [])
      return task
    },

    getTask(id) {
      return tasks.get(id)
    },

    updateTask(id, updates) {
      const task = tasks.get(id)
      if (!task) throw new Error(`Task ${id} not found`)
      const updated = { ...task, ...updates, updatedAt: new Date() }
      tasks.set(id, updated)
      return updated
    },

    listTasks(filter) {
      let result = Array.from(tasks.values())
      if (filter?.assignee) result = result.filter((t) => t.assignee === filter.assignee)
      if (filter?.status) result = result.filter((t) => t.status === filter.status)
      return result
    },

    addMessage(taskId, message) {
      const msg: Message = {
        ...message,
        id: uuidv4(),
        timestamp: new Date(),
      }
      const taskMessages = messages.get(taskId) || []
      taskMessages.push(msg)
      messages.set(taskId, taskMessages)
      return msg
    },

    getMessages(taskId) {
      return messages.get(taskId) || []
    },
  }
}
