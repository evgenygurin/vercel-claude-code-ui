'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  Bell,
  Shield,
  Palette,
  Code,
  Database,
  Cloud,
  Key,
  Save,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '',
      bio: 'Full-stack developer passionate about AI and modern web technologies'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      securityAlerts: true,
      marketingEmails: false
    },
    appearance: {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    },
    ai: {
      defaultModel: 'claude-3-5-sonnet',
      maxTokens: 4000,
      temperature: 0.7,
      autoSave: true,
      codeCompletion: true
    },
    integrations: {
      github: true,
      slack: false,
      discord: true,
      vercel: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAlerts: true
    }
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', settings)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = 'claude-code-ui-settings.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
        } catch (error) {
          console.error('Failed to import settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <label htmlFor="import-settings">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </span>
            </Button>
          </label>
          <input
            id="import-settings"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={settings.profile.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, name: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  className="w-full p-3 border rounded-md bg-background resize-none"
                  rows={3}
                  value={settings.profile.bio}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, bio: e.target.value }
                  }))}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {key === 'emailNotifications' && 'Receive notifications via email'}
                      {key === 'pushNotifications' && 'Receive push notifications in browser'}
                      {key === 'weeklyReports' && 'Get weekly activity summaries'}
                      {key === 'securityAlerts' && 'Important security notifications'}
                      {key === 'marketingEmails' && 'Product updates and marketing'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, [key]: checked }
                    }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={settings.appearance.theme}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, theme: e.target.value }
                    }))}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={settings.appearance.language}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, language: e.target.value }
                    }))}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>AI Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure AI model settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Model</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={settings.ai.defaultModel}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, defaultModel: e.target.value }
                    }))}
                  >
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Tokens</label>
                  <Input
                    type="number"
                    value={settings.ai.maxTokens}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, maxTokens: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Save</h4>
                    <p className="text-sm text-muted-foreground">Automatically save your work</p>
                  </div>
                  <Switch
                    checked={settings.ai.autoSave}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, autoSave: checked }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Code Completion</h4>
                    <p className="text-sm text-muted-foreground">Enable AI code completion</p>
                  </div>
                  <Switch
                    checked={settings.ai.codeCompletion}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, codeCompletion: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="h-5 w-5" />
                <span>Integrations</span>
              </CardTitle>
              <CardDescription>
                Manage connections to external services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(settings.integrations).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {key === 'github' && <Code className="h-5 w-5" />}
                      {key === 'slack' && <Database className="h-5 w-5" />}
                      {key === 'discord' && <Bell className="h-5 w-5" />}
                      {key === 'vercel' && <Cloud className="h-5 w-5" />}
                      <div>
                        <h4 className="font-medium capitalize">{key}</h4>
                        <p className="text-sm text-muted-foreground">
                          {value ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={value ? 'default' : 'secondary'}>
                        {value ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          integrations: { ...prev.integrations, [key]: checked }
                        }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {settings.security.twoFactorAuth ? (
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  ) : (
                    <Badge variant="secondary">Disabled</Badge>
                  )}
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, twoFactorAuth: checked }
                    }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password Expiry (days)</label>
                  <Input
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, passwordExpiry: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Login Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified of new login attempts
                  </p>
                </div>
                <Switch
                  checked={settings.security.loginAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, loginAlerts: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Tools</CardTitle>
          <CardDescription>
            Commands used for settings management and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-muted p-2 rounded">
              jq '.settings | to_entries[] | select(.value == true)' config.json
            </div>
            <div className="bg-muted p-2 rounded">
              yq '.user.preferences.theme' settings.yaml
            </div>
            <div className="bg-muted p-2 rounded">
              rg "settings|config" --glob "*.ts" --count
            </div>
            <div className="bg-muted p-2 rounded">
              rg "settings|config" --glob "*.tsx" --count
            </div>
            <div className="bg-muted p-2 rounded">
              ast-grep --lang typescript --pattern 'useSettings|useConfig'
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
