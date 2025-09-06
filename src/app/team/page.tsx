import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { TeamManagement } from '@/components/team/TeamManagement'

export default function TeamPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading team management...</div>}>
        <TeamManagement />
      </Suspense>
    </MainLayout>
  )
}
