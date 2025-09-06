import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsDashboard />
      </Suspense>
    </MainLayout>
  )
}
