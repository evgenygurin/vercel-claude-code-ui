import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { IntegrationsHub } from '@/components/integrations/IntegrationsHub'

export default function IntegrationsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading integrations...</div>}>
        <IntegrationsHub />
      </Suspense>
    </MainLayout>
  )
}
