import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { CodeEditor } from '@/components/editor/CodeEditor'

export default function EditorPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading code editor...</div>}>
        <CodeEditor />
      </Suspense>
    </MainLayout>
  )
}
