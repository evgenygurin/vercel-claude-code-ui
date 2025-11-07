'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  MessageSquare,
  Settings,
  MoreVertical,
  Play,
  Pause,
  Archive,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Clock,
  Bot,
  User,
  Code,
  Zap
} from 'lucide-react'
import { ClaudeSession, ClaudeProject } from '@/lib/v0-config'
import { useRouter } from 'next/navigation'

interface SessionManagerProps {
  onSessionSelect?: (session: ClaudeSession) => void
  selectedSessionId?: string
}

export function SessionManager({ onSessionSelect, selectedSessionId }: SessionManagerProps) {
  const router = useRouter()
  const [sessions, setSessions] = useState<ClaudeSession[]>([])
  const [projects, setProjects] = useState<ClaudeProject[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<ClaudeSession | null>(null)
  const [newSession, setNewSession] = useState({
    name: '',
    description: '',
    projectId: '',
  })

  useEffect(() => {
    loadSessions()
    loadProjects()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const createSession = async () => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      })

      if (response.ok) {
        await loadSessions()
        setNewSession({ name: '', description: '', projectId: '' })
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  const updateSession = async (sessionId: string, updates: Partial<ClaudeSession>) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await loadSessions()
        setIsEditDialogOpen(false)
        setEditingSession(null)
      }
    } catch (error) {
      console.error('Failed to update session:', error)
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadSessions()
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-yellow-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Claude Sessions</h2>
          <p className="text-muted-foreground">
            Manage your AI coding sessions and projects
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
              <DialogDescription>
                Start a new Claude coding session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Session Name</label>
                <Input
                  value={newSession.name}
                  onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                  placeholder="My Coding Session"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="What are you working on?"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Project (Optional)</label>
                <select
                  value={newSession.projectId}
                  onChange={(e) => setNewSession({ ...newSession, projectId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">No Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createSession} disabled={!newSession.name}>
                Create Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedSessionId === session.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => {
              onSessionSelect?.(session)
              router.push(`/claude/chat/${session.id}`)
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{session.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {session.description || 'No description'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingSession(session)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          updateSession(session.id, {
                            status: session.status === 'active' ? 'inactive' : 'active'
                          })
                        }}
                      >
                        {session.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          updateSession(session.id, { status: 'archived' })
                        }}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(session.id)
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{session.messages.length} messages</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(session.updatedAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {session.settings.model}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Badge variant="secondary" className="text-xs">
                      Temp: {session.settings.temperature}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Max: {session.settings.maxTokens}
                    </Badge>
                  </div>
                </div>

                {session.projectId && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Code className="h-3 w-3" />
                    <span>
                      {projects.find(p => p.id === session.projectId)?.name || 'Unknown Project'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Session Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>
              Update session settings and information
            </DialogDescription>
          </DialogHeader>
          {editingSession && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Session Name</label>
                <Input
                  value={editingSession.name}
                  onChange={(e) => setEditingSession({
                    ...editingSession,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={editingSession.description || ''}
                  onChange={(e) => setEditingSession({
                    ...editingSession,
                    description: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Model</label>
                <select
                  value={editingSession.settings.model}
                  onChange={(e) => setEditingSession({
                    ...editingSession,
                    settings: {
                      ...editingSession.settings,
                      model: e.target.value
                    }
                  })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                  <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Temperature</label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editingSession.settings.temperature}
                    onChange={(e) => setEditingSession({
                      ...editingSession,
                      settings: {
                        ...editingSession.settings,
                        temperature: parseFloat(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Tokens</label>
                  <Input
                    type="number"
                    min="100"
                    max="8000"
                    value={editingSession.settings.maxTokens}
                    onChange={(e) => setEditingSession({
                      ...editingSession,
                      settings: {
                        ...editingSession.settings,
                        maxTokens: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => editingSession && updateSession(editingSession.id, editingSession)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
