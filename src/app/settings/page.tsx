import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SettingsPanel } from '@/components/settings/SettingsPanel'

export default function SettingsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading settings...</div>}>
        <SettingsPanel />
      </Suspense>
    </MainLayout>
  )
}
