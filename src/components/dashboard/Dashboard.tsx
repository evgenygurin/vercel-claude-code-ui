'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SystemMonitor } from '@/components/system/SystemMonitor'
import {
  Code,
  MessageSquare,
  FileText,
  Users,
  TrendingUp,
  Zap,
  Plus,
  ArrowRight,
  Activity,
  Database
} from 'lucide-react'

export function Dashboard() {
  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+2',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'AI Conversations',
      value: '847',
      change: '+12%',
      icon: MessageSquare,
      color: 'text-green-600'
    },
    {
      title: 'Code Generated',
      value: '24.5K',
      change: '+8%',
      icon: Code,
      color: 'text-purple-600'
    },
    {
      title: 'Team Members',
      value: '8',
      change: '+1',
      icon: Users,
      color: 'text-orange-600'
    },
    {
      title: 'API Calls',
      value: '2,847',
      change: '+12%',
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      title: 'Deployments',
      value: '24',
      change: '+3',
      icon: TrendingUp,
      color: 'text-indigo-600'
    },
    {
      title: 'Storage Used',
      value: '1.2GB',
      change: '15%',
      icon: Database,
      color: 'text-red-600'
    },
    {
      title: 'Active Sessions',
      value: '16',
      change: '+4',
      icon: Activity,
      color: 'text-teal-600'
    }
  ]

  const recentProjects = [
    { name: 'E-commerce Platform', status: 'In Progress', progress: 75 },
    { name: 'AI Chat Interface', status: 'Review', progress: 90 },
    { name: 'File Manager v2', status: 'Completed', progress: 100 },
    { name: 'Analytics Dashboard', status: 'Planning', progress: 20 }
  ]

  const recentActivity = [
    { action: 'Generated code for user authentication', time: '2 minutes ago' },
    { action: 'Updated project documentation', time: '15 minutes ago' },
    { action: 'Created new component library', time: '1 hour ago' },
    { action: 'Integrated with GitHub API', time: '2 hours ago' }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Monitor</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest development activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">{project.name}</h4>
                    <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {project.progress}% complete
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex-col space-y-2">
              <Code className="h-6 w-6" />
              <span>Generate Code</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>Start Chat</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Zap className="h-6 w-6" />
              <span>View Integrations</span>
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="system">
          <SystemMonitor />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Advanced analytics powered by development tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced analytics with fd, ripgrep, ast-grep, jq, and yq integration
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-tools">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Tool Integration</CardTitle>
                <CardDescription>
                  Advanced development tools for AI-powered workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">fd</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Code className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">ripgrep</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">ast-grep</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Database className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium">jq</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick AI Actions</CardTitle>
                <CardDescription>
                  Common AI-powered development tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Code className="mr-2 h-4 w-4" />
                    Generate Component
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start AI Chat
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Codebase
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
