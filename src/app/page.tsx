import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    </MainLayout>
  )
}