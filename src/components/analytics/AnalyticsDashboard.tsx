'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Code,
  FileText,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Filter,
  Calendar
} from 'lucide-react'

interface Metric {
  label: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: any
  color: string
}

interface ChartData {
  name: string
  value: number
  date: string
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(false)

  const metrics: Metric[] = [
    {
      label: 'Total Users',
      value: 1247,
      change: 12.5,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Code Generated',
      value: 45632,
      change: 8.2,
      changeType: 'increase',
      icon: Code,
      color: 'text-green-600'
    },
    {
      label: 'Files Processed',
      value: 8921,
      change: -2.1,
      changeType: 'decrease',
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      label: 'Avg Response Time',
      value: 1.2,
      change: -15.3,
      changeType: 'increase',
      icon: Clock,
      color: 'text-purple-600'
    }
  ]

  const activityData: ChartData[] = [
    { name: 'Mon', value: 120, date: '2024-01-01' },
    { name: 'Tue', value: 98, date: '2024-01-02' },
    { name: 'Wed', value: 145, date: '2024-01-03' },
    { name: 'Thu', value: 167, date: '2024-01-04' },
    { name: 'Fri', value: 189, date: '2024-01-05' },
    { name: 'Sat', value: 134, date: '2024-01-06' },
    { name: 'Sun', value: 156, date: '2024-01-07' }
  ]

  const toolUsageData = [
    { name: 'fd', usage: 85, color: '#3b82f6' },
    { name: 'ripgrep', usage: 72, color: '#10b981' },
    { name: 'ast-grep', usage: 58, color: '#f59e0b' },
    { name: 'jq', usage: 45, color: '#8b5cf6' },
    { name: 'yq', usage: 38, color: '#ef4444' }
  ]

  const recentActivities = [
    {
      action: 'File analysis completed',
      tool: 'fd + ripgrep',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'success'
    },
    {
      action: 'Code search executed',
      tool: 'ripgrep',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'success'
    },
    {
      action: 'AST analysis performed',
      tool: 'ast-grep',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'success'
    },
    {
      action: 'JSON processing completed',
      tool: 'jq',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'success'
    },
    {
      action: 'YAML validation failed',
      tool: 'yq',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'error'
    }
  ]

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const data = {
      metrics,
      activityData,
      toolUsageData,
      recentActivities,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your development workflow and tool usage
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {['7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range as any)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {typeof metric.value === 'number' && metric.value < 100
                    ? metric.value.toFixed(1)
                    : metric.value.toLocaleString()
                  }
                  {metric.label.includes('Time') && 's'}
                </div>
                <div className="flex items-center text-xs">
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-muted-foreground ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Daily usage patterns over the selected time range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-12">{day.name}</span>
                    <div className="flex-1">
                      <Progress value={(day.value / 200) * 100} className="h-2" />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {day.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tool Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Tool Usage Distribution</CardTitle>
            <CardDescription>
              Most frequently used development tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {toolUsageData.map((tool, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tool.color }}
                    />
                    <span className="text-sm font-medium">{tool.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={tool.usage} className="w-20 h-2" />
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {tool.usage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest tool executions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      Tool: {activity.tool}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString()}
                  </p>
                  <Badge variant={activity.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            AI-powered recommendations based on your usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Optimization Opportunity
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Consider using fd with parallel processing for large file operations
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Peak Usage Time
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Highest activity detected between 2-4 PM
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Tool Efficiency
                </span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                ripgrep processes 3x faster than traditional grep
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Tools</CardTitle>
          <CardDescription>
            Commands used for data processing and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-muted p-2 rounded">
              jq '.metrics[] | select(.change > 0)' analytics.json
            </div>
            <div className="bg-muted p-2 rounded">
              yq '.tools | to_entries | sort_by(.value.usage)' config.yaml
            </div>
            <div className="bg-muted p-2 rounded">
              rg "performance|analytics" --glob "*.ts" --count
            </div>
            <div className="bg-muted p-2 rounded">
              rg "performance|analytics" --glob "*.tsx" --count
            </div>
            <div className="bg-muted p-2 rounded">
              fd . src --type f | xargs wc -l | tail -1
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
