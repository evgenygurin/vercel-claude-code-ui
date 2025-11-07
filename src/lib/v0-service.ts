import { v0Config, V0GenerationRequest, V0GenerationResponse } from './v0-config'

export class V0Service {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = v0Config.apiKey
    this.baseUrl = v0Config.baseUrl
  }

  async generateComponent(request: V0GenerationRequest): Promise<V0GenerationResponse> {
    if (!this.apiKey) {
      throw new Error('V0_API_KEY is not configured')
    }

    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`V0 API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('V0 Service Error:', error)
      throw error
    }
  }

  async createProject(prompt: string, context?: string): Promise<V0GenerationResponse> {
    const request: V0GenerationRequest = {
      prompt,
      context,
      framework: 'react',
      style: 'tailwind',
    }

    return this.generateComponent(request)
  }

  async generateFromClaudeSession(sessionId: string, prompt: string): Promise<V0GenerationResponse> {
    // This would integrate with Claude session context
    const context = `Claude session: ${sessionId}\nUser request: ${prompt}`
    
    return this.createProject(prompt, context)
  }

  async deployToVercel(projectId: string): Promise<{ url: string; deploymentId: string }> {
    if (!this.apiKey) {
      throw new Error('V0_API_KEY is not configured')
    }

    try {
      const response = await fetch(`${this.baseUrl}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ projectId }),
      })

      if (!response.ok) {
        throw new Error(`Vercel deployment error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Vercel Deployment Error:', error)
      throw error
    }
  }
}

// Singleton instance
export const v0Service = new V0Service()
