import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { FileManager } from '@/components/files/FileManager'

export default function FilesPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading file manager...</div>}>
        <FileManager />
      </Suspense>
    </MainLayout>
  )
}
