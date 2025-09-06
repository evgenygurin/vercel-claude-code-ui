'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  RefreshCw,
  Terminal,
  FileText,
  Search
} from 'lucide-react'

interface SystemMetrics {
  typescript_files: number
  react_components: number
  imports: number
  dependencies: number
  features: number
  tools_used: string[]
}

export function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchSystemMetrics = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would call our analysis API
      // For now, we'll simulate the data
      const mockMetrics: SystemMetrics = {
        typescript_files: 14,
        react_components: 10,
        imports: 41,
        dependencies: 42,
        features: 4,
        tools_used: ['fd', 'ripgrep', 'ast-grep', 'jq', 'yq']
      }
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Failed to fetch system metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemMetrics()
  }, [])

  const runAnalysis = () => {
    // In a real implementation, this would trigger the analysis scripts
    console.log('Running system analysis...')
    fetchSystemMetrics()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Monitor</h2>
          <p className="text-muted-foreground">
            Real-time analysis using advanced development tools
          </p>
        </div>
        <Button onClick={runAnalysis} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </div>

      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TypeScript Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.typescript_files}</div>
              <p className="text-xs text-muted-foreground">
                Files analyzed with fd
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">React Components</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.react_components}</div>
              <p className="text-xs text-muted-foreground">
                Components found
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.dependencies}</div>
              <p className="text-xs text-muted-foreground">
                Processed with jq
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Code Imports</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.imports}</div>
              <p className="text-xs text-muted-foreground">
                Found with ripgrep
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.features}</div>
              <p className="text-xs text-muted-foreground">
                From YAML config
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tools Used</CardTitle>
              <Terminal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {metrics.tools_used.map((tool) => (
                  <Badge key={tool} variant="secondary" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Advanced development tools
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Analysis Commands</CardTitle>
          <CardDescription>
            Commands used for system analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="font-mono text-sm bg-muted p-2 rounded">
            fd --type f --extension ts --extension tsx
          </div>
          <div className="font-mono text-sm bg-muted p-2 rounded">
            rg "^import" --glob "*.ts"
          </div>
          <div className="font-mono text-sm bg-muted p-2 rounded">
            rg "^import" --glob "*.tsx"
          </div>
          <div className="font-mono text-sm bg-muted p-2 rounded">
            jq '.dependencies | length' package.json
          </div>
          <div className="font-mono text-sm bg-muted p-2 rounded">
            yq '.features | length' config.yaml
          </div>
          <div className="font-mono text-sm bg-muted p-2 rounded">
            ast-grep --lang typescript --pattern 'function...'
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
