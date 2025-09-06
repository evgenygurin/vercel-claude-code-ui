'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Github,
  Slack,
  MessageSquare,
  GitBranch,
  Zap,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Key,
  Webhook,
  Database,
  Cloud,
  Bot
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  status: 'connected' | 'disconnected' | 'error' | 'configuring'
  category: 'version-control' | 'communication' | 'deployment' | 'ai' | 'database'
  lastSync?: Date
  config: {
    apiKey?: string
    webhookUrl?: string
    repository?: string
    workspace?: string
  }
}

export function IntegrationsHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Version control and repository management',
      icon: Github,
      status: 'connected',
      category: 'version-control',
      lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      config: {
        repository: 'vercel-claude-code-ui',
        apiKey: '••••••••••••••••'
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: Slack,
      status: 'connected',
      category: 'communication',
      lastSync: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      config: {
        webhookUrl: 'https://hooks.slack.com/...',
        workspace: 'claude-dev-team'
      }
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Community and real-time chat',
      icon: MessageSquare,
      status: 'disconnected',
      category: 'communication',
      config: {}
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Deployment and hosting platform',
      icon: Cloud,
      status: 'connected',
      category: 'deployment',
      lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      config: {
        apiKey: '••••••••••••••••'
      }
    },
    {
      id: 'claude',
      name: 'Claude AI',
      description: 'AI-powered code generation and analysis',
      icon: Bot,
      status: 'connected',
      category: 'ai',
      lastSync: new Date(),
      config: {
        apiKey: '••••••••••••••••'
      }
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'PostgreSQL database and real-time subscriptions',
      icon: Database,
      status: 'configuring',
      category: 'database',
      config: {
        apiKey: '••••••••••••••••'
      }
    }
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100'
      case 'disconnected': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'configuring': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />
      case 'disconnected': return <XCircle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      case 'configuring': return <Settings className="h-4 w-4" />
      default: return <XCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Integration['category']) => {
    switch (category) {
      case 'version-control': return 'bg-blue-100 text-blue-800'
      case 'communication': return 'bg-green-100 text-green-800'
      case 'deployment': return 'bg-purple-100 text-purple-800'
      case 'ai': return 'bg-orange-100 text-orange-800'
      case 'database': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleConnect = async (integration: Integration) => {
    setIsConfiguring(true)
    try {
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIntegrations(prev =>
        prev.map(int =>
          int.id === integration.id
            ? { ...int, status: 'connected' as const, lastSync: new Date() }
            : int
        )
      )
    } catch (error) {
      setIntegrations(prev =>
        prev.map(int =>
          int.id === integration.id
            ? { ...int, status: 'error' as const }
            : int
        )
      )
    } finally {
      setIsConfiguring(false)
    }
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? { ...int, status: 'disconnected' as const, config: {} }
          : int
      )
    )
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const totalCount = integrations.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Integrations Hub</h2>
          <p className="text-muted-foreground">
            Connect external services and APIs to enhance your development workflow
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {connectedCount}/{totalCount} Connected
          </Badge>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['version-control', 'communication', 'deployment', 'ai', 'database'].map(category => {
          const categoryIntegrations = integrations.filter(i => i.category === category)
          const connectedInCategory = categoryIntegrations.filter(i => i.status === 'connected').length

          return (
            <Card key={category}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium capitalize">{category.replace('-', ' ')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {connectedInCategory}/{categoryIntegrations.length} connected
                    </p>
                  </div>
                  <Badge className={getCategoryColor(category as Integration['category'])}>
                    {connectedInCategory}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon
          return (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge className={`${getCategoryColor(integration.category)} text-xs`}>
                        {integration.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(integration.status)}`}>
                    {getStatusIcon(integration.status)}
                    <span className="capitalize">{integration.status}</span>
                  </div>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Configuration Status */}
                  {integration.status === 'connected' && integration.lastSync && (
                    <div className="text-sm text-muted-foreground">
                      Last sync: {integration.lastSync.toLocaleTimeString()}
                    </div>
                  )}

                  {/* Configuration Fields */}
                  {Object.entries(integration.config).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="relative">
                        <Input
                          type={key.includes('key') || key.includes('url') ? 'password' : 'text'}
                          value={value || ''}
                          placeholder={`Enter ${key}`}
                          readOnly
                          className="pr-10"
                        />
                        {key.includes('key') && (
                          <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        )}
                        {key.includes('url') && (
                          <Webhook className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedIntegration(integration)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(integration)}
                        disabled={isConfiguring}
                      >
                        {isConfiguring ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Webhooks & API Keys Info */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys & Webhooks</CardTitle>
          <CardDescription>
            Secure management of external service credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Securely stored and encrypted API keys for external services
                </p>
                <div className="text-xs font-mono bg-background p-2 rounded">
                  ANTHROPIC_API_KEY=••••••••••••••••
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Webhook className="h-4 w-4 mr-2" />
                  Webhooks
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Real-time notifications and event handling
                </p>
                <div className="text-xs font-mono bg-background p-2 rounded">
                  https://api.claude.dev/webhooks/...
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Integration Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Tools</CardTitle>
          <CardDescription>
            Commands used for managing external service integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-muted p-2 rounded">
              curl -X POST https://api.github.com/repos/... -H "Authorization: Bearer $GITHUB_TOKEN"
            </div>
            <div className="bg-muted p-2 rounded">
              jq '.integrations | to_entries[] | select(.value == true)' config.json
            </div>
            <div className="bg-muted p-2 rounded">
              yq '.services[] | select(.enabled == true)' integrations.yaml
            </div>
            <div className="bg-muted p-2 rounded">
              ast-grep --lang typescript --pattern 'fetch|axios' --glob "*.ts"
            </div>
            <div className="bg-muted p-2 rounded">
              ast-grep --lang typescript --pattern 'fetch|axios' --glob "*.tsx"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
