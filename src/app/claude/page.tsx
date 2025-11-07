'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SessionManager } from '@/components/claude/SessionManager'
import { ProjectManager } from '@/components/claude/ProjectManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, Folder } from 'lucide-react'

export default function ClaudePage() {
  const [activeTab, setActiveTab] = useState('sessions')

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Claude Code Management</h1>
          <p className="text-muted-foreground">
            Manage your AI coding sessions and projects with v0 integration
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessions" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <Folder className="h-4 w-4" />
              <span>Projects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-6">
            <SessionManager />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectManager />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
