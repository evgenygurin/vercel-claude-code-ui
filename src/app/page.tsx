import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Dashboard } from '@/components/dashboard/Dashboard'

export default function HomePage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </MainLayout>
  )
}
