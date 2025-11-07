import { ClaudeSession, ClaudeProject, ClaudeMessage } from './v0-config'

export class ClaudeSessionService {
  private sessions: Map<string, ClaudeSession> = new Map()
  private projects: Map<string, ClaudeProject> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  // Session Management
  async createSession(name: string, description?: string, projectId?: string): Promise<ClaudeSession> {
    const session: ClaudeSession = {
      id: this.generateId(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      projectId,
      settings: {
        model: 'claude-3-sonnet-20240229',
        temperature: 0.7,
        maxTokens: 4000,
        systemPrompt: 'You are Claude, an AI assistant specialized in code generation and development tasks. You have access to advanced development tools including fd, ripgrep, ast-grep, jq, and yq for comprehensive code analysis and project management.',
      },
      messages: [],
    }

    this.sessions.set(session.id, session)
    this.saveToStorage()
    return session
  }

  async getSession(sessionId: string): Promise<ClaudeSession | null> {
    return this.sessions.get(sessionId) || null
  }

  async getAllSessions(): Promise<ClaudeSession[]> {
    return Array.from(this.sessions.values())
  }

  async updateSession(sessionId: string, updates: Partial<ClaudeSession>): Promise<ClaudeSession | null> {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    }

    this.sessions.set(sessionId, updatedSession)
    this.saveToStorage()
    return updatedSession
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const deleted = this.sessions.delete(sessionId)
    if (deleted) {
      this.saveToStorage()
    }
    return deleted
  }

  // Message Management
  async addMessage(sessionId: string, message: Omit<ClaudeMessage, 'id' | 'timestamp'>): Promise<ClaudeMessage | null> {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const newMessage: ClaudeMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date(),
    }

    session.messages.push(newMessage)
    session.updatedAt = new Date()
    this.sessions.set(sessionId, session)
    this.saveToStorage()
    return newMessage
  }

  async getMessages(sessionId: string): Promise<ClaudeMessage[]> {
    const session = this.sessions.get(sessionId)
    return session?.messages || []
  }

  async clearMessages(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    session.messages = []
    session.updatedAt = new Date()
    this.sessions.set(sessionId, session)
    this.saveToStorage()
    return true
  }

  // Project Management
  async createProject(name: string, description?: string): Promise<ClaudeProject> {
    const project: ClaudeProject = {
      id: this.generateId(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      sessions: [],
      settings: {
        defaultModel: 'claude-3-sonnet-20240229',
        defaultTemperature: 0.7,
        defaultMaxTokens: 4000,
        systemPrompt: 'You are Claude, an AI assistant specialized in code generation and development tasks.',
      },
      files: [],
    }

    this.projects.set(project.id, project)
    this.saveToStorage()
    return project
  }

  async getProject(projectId: string): Promise<ClaudeProject | null> {
    return this.projects.get(projectId) || null
  }

  async getAllProjects(): Promise<ClaudeProject[]> {
    return Array.from(this.projects.values())
  }

  async updateProject(projectId: string, updates: Partial<ClaudeProject>): Promise<ClaudeProject | null> {
    const project = this.projects.get(projectId)
    if (!project) return null

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    }

    this.projects.set(projectId, updatedProject)
    this.saveToStorage()
    return updatedProject
  }

  async deleteProject(projectId: string): Promise<boolean> {
    // Delete all sessions associated with this project
    const sessionsToDelete = Array.from(this.sessions.values())
      .filter(session => session.projectId === projectId)
      .map(session => session.id)

    sessionsToDelete.forEach(sessionId => {
      this.sessions.delete(sessionId)
    })

    const deleted = this.projects.delete(projectId)
    if (deleted) {
      this.saveToStorage()
    }
    return deleted
  }

  // Storage Management
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const sessionsData = localStorage.getItem('claude-sessions')
      const projectsData = localStorage.getItem('claude-projects')

      if (sessionsData) {
        const sessions = JSON.parse(sessionsData)
        sessions.forEach((session: any) => {
          session.createdAt = new Date(session.createdAt)
          session.updatedAt = new Date(session.updatedAt)
          session.messages.forEach((msg: any) => {
            msg.timestamp = new Date(msg.timestamp)
          })
          this.sessions.set(session.id, session)
        })
      }

      if (projectsData) {
        const projects = JSON.parse(projectsData)
        projects.forEach((project: any) => {
          project.createdAt = new Date(project.createdAt)
          project.updatedAt = new Date(project.updatedAt)
          project.sessions.forEach((session: any) => {
            session.createdAt = new Date(session.createdAt)
            session.updatedAt = new Date(session.updatedAt)
            session.messages.forEach((msg: any) => {
              msg.timestamp = new Date(msg.timestamp)
            })
          })
          this.projects.set(project.id, project)
        })
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error)
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('claude-sessions', JSON.stringify(Array.from(this.sessions.values())))
      localStorage.setItem('claude-projects', JSON.stringify(Array.from(this.projects.values())))
    } catch (error) {
      console.error('Failed to save data to storage:', error)
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

// Singleton instance
export const claudeSessionService = new ClaudeSessionService()
