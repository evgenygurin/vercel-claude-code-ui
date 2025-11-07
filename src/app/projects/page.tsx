'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FolderOpen,
  Search,
  RefreshCw,
  ExternalLink,
  Calendar,
  Folder,
  FileCode,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Project {
  id: string
  name: string
  path: string
  lastModified: Date
  type: 'claude' | 'cursor' | 'vscode'
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects/discover')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
        setFilteredProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProjects(filtered)
    } else {
      setFilteredProjects(projects)
    }
  }, [searchQuery, projects])

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'claude':
        return <FileCode className="h-4 w-4 text-blue-500" />
      case 'cursor':
        return <FileCode className="h-4 w-4 text-purple-500" />
      default:
        return <Folder className="h-4 w-4 text-gray-500" />
    }
  }

  const getProjectTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      claude: 'default',
      cursor: 'secondary',
      vscode: 'outline',
    }

    return (
      <Badge variant={variants[type] as any}>
        {type.toUpperCase()}
      </Badge>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FolderOpen className="h-8 w-8" />
              Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              Auto-discovered from ~/.claude/projects/ and local directories
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchProjects}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Claude Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter((p) => p.type === 'claude').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Local Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter((p) => p.type !== 'claude').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Projects</CardTitle>
            <CardDescription>
              Find projects by name or path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Projects ({filteredProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {getProjectTypeIcon(project.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{project.name}</h3>
                          {getProjectTypeBadge(project.type)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate font-mono">
                          {project.path}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Modified{' '}
                            {formatDistanceToNow(new Date(project.lastModified), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No projects found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
