'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  GitBranch,
  GitCommit,
  GitMerge,
  Plus,
  RefreshCw,
  Check,
  X,
  FileText
} from 'lucide-react'

interface GitStatus {
  branch: string
  ahead: number
  behind: number
  changes: GitChange[]
}

interface GitChange {
  path: string
  status: 'added' | 'modified' | 'deleted' | 'untracked'
  staged: boolean
}

interface GitCommit {
  hash: string
  message: string
  author: string
  date: string
}

export function GitExplorer() {
  const [status, setStatus] = useState<GitStatus>({
    branch: 'main',
    ahead: 0,
    behind: 0,
    changes: [],
  })
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [loading, setLoading] = useState(false)

  const fetchGitStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/git/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)
      }
    } catch (error) {
      console.error('Failed to fetch git status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGitLog = async () => {
    try {
      const response = await fetch('/api/git/log')
      if (response.ok) {
        const data = await response.json()
        setCommits(data.commits)
      }
    } catch (error) {
      console.error('Failed to fetch git log:', error)
    }
  }

  const stageFile = async (path: string) => {
    try {
      await fetch('/api/git/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      fetchGitStatus()
    } catch (error) {
      console.error('Failed to stage file:', error)
    }
  }

  const unstageFile = async (path: string) => {
    try {
      await fetch('/api/git/unstage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      fetchGitStatus()
    } catch (error) {
      console.error('Failed to unstage file:', error)
    }
  }

  useEffect(() => {
    fetchGitStatus()
    fetchGitLog()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'modified':
        return <FileText className="h-4 w-4 text-yellow-500" />
      case 'deleted':
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Git Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Git Status
              </CardTitle>
              <CardDescription>
                Current branch: <Badge variant="outline">{status.branch}</Badge>
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchGitStatus}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {status.ahead > 0 && (
              <Badge variant="default">
                ↑ {status.ahead} ahead
              </Badge>
            )}
            {status.behind > 0 && (
              <Badge variant="secondary">
                ↓ {status.behind} behind
              </Badge>
            )}
            {status.changes.length === 0 && (
              <Badge variant="outline" className="text-green-600">
                <Check className="h-3 w-3 mr-1" />
                Clean working directory
              </Badge>
            )}
          </div>

          {/* Changes List */}
          {status.changes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm mb-2">Changes:</h4>
              <ScrollArea className="h-[300px]">
                {status.changes.map((change, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(change.status)}
                      <span className="text-sm font-mono">{change.path}</span>
                      {change.staged && (
                        <Badge variant="outline" className="text-xs">
                          staged
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        change.staged ? unstageFile(change.path) : stageFile(change.path)
                      }
                    >
                      {change.staged ? 'Unstage' : 'Stage'}
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Commits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Recent Commits
          </CardTitle>
          <CardDescription>Latest commits on {status.branch}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {commits.map((commit, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-3 rounded border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <GitMerge className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{commit.message}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{commit.author}</span>
                      <span>•</span>
                      <span>{commit.date}</span>
                    </div>
                    <code className="text-xs text-muted-foreground mt-1 block">
                      {commit.hash}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
