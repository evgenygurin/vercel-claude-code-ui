'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { GitExplorer } from '@/components/git/GitExplorer'
import { GitBranch } from 'lucide-react'

export default function GitPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GitBranch className="h-8 w-8" />
            Git Repository
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your git repository, view changes, and commit files
          </p>
        </div>

        <GitExplorer />
      </div>
    </MainLayout>
  )
}
