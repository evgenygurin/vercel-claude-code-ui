'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Code, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Zap, 
  Users, 
  Settings,
  Play,
  Download,
  Upload,
  Star,
  GitBranch,
  Clock,
  Activity
} from 'lucide-react'

const features = [
  {
    title: 'Code Editor',
    description: 'Advanced code editor with syntax highlighting and IntelliSense',
    icon: Code,
    href: '/editor',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    title: 'File Manager',
    description: 'Organize and manage your project files with drag & drop',
    icon: FileText,
    href: '/files',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    title: 'Claude Sessions',
    description: 'Manage Claude AI coding sessions with v0 integration',
    icon: MessageSquare,
    href: '/claude',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    title: 'AI Chat',
    description: 'Chat with Claude AI for code assistance and debugging',
    icon: MessageSquare,
    href: '/chat',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
  },
  {
    title: 'Analytics',
    description: 'Track your coding progress and project metrics',
    icon: BarChart3,
    href: '/analytics',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
  {
    title: 'Integrations',
    description: 'Connect with external services and APIs',
    icon: Zap,
    href: '/integrations',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
  },
  {
    title: 'Team Collaboration',
    description: 'Work together with your team in real-time',
    icon: Users,
    href: '/team',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
  },
]

const recentProjects = [
  {
    name: 'Claude Code UI',
    type: 'Next.js',
    lastModified: '2 hours ago',
    status: 'active',
  },
  {
    name: 'AI Assistant',
    type: 'React',
    lastModified: '1 day ago',
    status: 'completed',
  },
  {
    name: 'E-commerce Platform',
    type: 'Vue.js',
    lastModified: '3 days ago',
    status: 'in-progress',
  },
]

const stats = [
  {
    title: 'Total Projects',
    value: '12',
    change: '+2 this week',
    icon: GitBranch,
    color: 'text-blue-600',
  },
  {
    title: 'Lines of Code',
    value: '45,231',
    change: '+1,234 today',
    icon: Code,
    color: 'text-green-600',
  },
  {
    title: 'Active Sessions',
    value: '3',
    change: '2 hours avg',
    icon: Activity,
    color: 'text-purple-600',
  },
  {
    title: 'AI Interactions',
    value: '127',
    change: '+23 today',
    icon: MessageSquare,
    color: 'text-orange-600',
  },
]

export function Dashboard() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card 
                key={feature.title}
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
                onClick={() => setSelectedFeature(feature.title)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Navigate to feature
                    }}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your recently worked on projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Code className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        project.status === 'active' ? 'default' :
                        project.status === 'completed' ? 'secondary' : 'outline'
                      }
                    >
                      {project.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.lastModified}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Create New File
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Project
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Project Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <Star className="h-4 w-4 mr-2" />
                Add to Favorites
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}