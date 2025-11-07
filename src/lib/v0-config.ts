// V0 Platform API Configuration
export const v0Config = {
  apiKey: process.env.V0_API_KEY || '',
  baseUrl: 'https://v0.dev/api',
  timeout: 30000, // 30 seconds
}

// Claude Code Session Management Types
export interface ClaudeSession {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'inactive' | 'archived'
  projectId?: string
  settings: {
    model: string
    temperature: number
    maxTokens: number
    systemPrompt?: string
  }
  messages: ClaudeMessage[]
}

export interface ClaudeMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    tokens?: number
    model?: string
    tools?: string[]
  }
}

export interface ClaudeProject {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'inactive' | 'archived'
  sessions: ClaudeSession[]
  settings: {
    defaultModel: string
    defaultTemperature: number
    defaultMaxTokens: number
    systemPrompt?: string
  }
  files?: ProjectFile[]
}

export interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  type: 'code' | 'document' | 'config' | 'other'
  size: number
  lastModified: Date
}

// V0 Integration Types
export interface V0GenerationRequest {
  prompt: string
  context?: string
  framework?: 'react' | 'vue' | 'svelte' | 'html'
  style?: 'tailwind' | 'css' | 'styled-components'
  components?: string[]
}

export interface V0GenerationResponse {
  id: string
  code: string
  components: V0Component[]
  dependencies: string[]
  demoUrl?: string
  createdAt: Date
}

export interface V0Component {
  name: string
  code: string
  type: 'component' | 'page' | 'layout' | 'hook' | 'util'
  dependencies: string[]
}
