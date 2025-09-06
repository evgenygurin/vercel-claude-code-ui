import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { AIChatInterface } from '@/components/chat/AIChatInterface'

export default function ChatPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading AI chat...</div>}>
        <AIChatInterface />
      </Suspense>
    </MainLayout>
  )
}
