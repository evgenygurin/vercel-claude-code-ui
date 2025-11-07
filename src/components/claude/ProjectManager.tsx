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
  Folder,
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
  Code,
  Zap,
  MessageSquare,
  FileText
} from 'lucide-react'
import { ClaudeProject } from '@/lib/v0-config'

interface ProjectManagerProps {
  onProjectSelect?: (project: ClaudeProject) => void
  selectedProjectId?: string
}

export function ProjectManager({ onProjectSelect, selectedProjectId }: ProjectManagerProps) {
  const [projects, setProjects] = useState<ClaudeProject[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ClaudeProject | null>(null)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const createProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      })

      if (response.ok) {
        await loadProjects()
        setNewProject({ name: '', description: '' })
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const updateProject = async (projectId: string, updates: Partial<ClaudeProject>) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await loadProjects()
        setIsEditDialogOpen(false)
        setEditingProject(null)
      }
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadProjects()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
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
          <h2 className="text-2xl font-bold">Claude Projects</h2>
          <p className="text-muted-foreground">
            Organize your AI coding projects and sessions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new Claude coding project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="My AI Project"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="What is this project about?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createProject} disabled={!newProject.name}>
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedProjectId === project.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onProjectSelect?.(project)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Folder className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {project.description || 'No description'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
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
                          setEditingProject(project)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          updateProject(project.id, {
                            status: project.status === 'active' ? 'inactive' : 'active'
                          })
                        }}
                      >
                        {project.status === 'active' ? (
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
                          updateProject(project.id, { status: 'archived' })
                        }}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteProject(project.id)
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
                    <span>{project.sessions.length} sessions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {project.settings.defaultModel}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Badge variant="secondary" className="text-xs">
                      Temp: {project.settings.defaultTemperature}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Max: {project.settings.defaultMaxTokens}
                    </Badge>
                  </div>
                </div>

                {project.files && project.files.length > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>{project.files.length} files</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="flex-1 mr-2">
                    <Bot className="h-3 w-3 mr-1" />
                    Sessions
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Zap className="h-3 w-3 mr-1" />
                    v0 Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project settings and information
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    description: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Default Model</label>
                <select
                  value={editingProject.settings.defaultModel}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    settings: {
                      ...editingProject.settings,
                      defaultModel: e.target.value
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
                  <label className="text-sm font-medium">Default Temperature</label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editingProject.settings.defaultTemperature}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      settings: {
                        ...editingProject.settings,
                        defaultTemperature: parseFloat(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Default Max Tokens</label>
                  <Input
                    type="number"
                    min="100"
                    max="8000"
                    value={editingProject.settings.defaultMaxTokens}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      settings: {
                        ...editingProject.settings,
                        defaultMaxTokens: parseInt(e.target.value)
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
              onClick={() => editingProject && updateProject(editingProject.id, editingProject)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
