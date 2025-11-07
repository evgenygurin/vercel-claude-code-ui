'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { ClaudeChat } from '@/components/claude/ClaudeChat'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ClaudeSession } from '@/lib/v0-config'

export default function ClaudeChatPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<ClaudeSession | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
      } else {
        router.push('/claude')
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      router.push('/claude')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (params.id) {
      loadSession(params.id as string)
    }
  }, [params.id, loadSession])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </MainLayout>
    )
  }

  if (!session) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <h2 className="text-2xl font-bold">Session not found</h2>
          <Button onClick={() => router.push('/claude')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/claude')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{session.name}</h1>
            <p className="text-muted-foreground">
              {session.description || 'Claude AI Coding Assistant'}
            </p>
          </div>
        </div>
        <ClaudeChat
          session={session}
          onSessionUpdate={setSession}
        />
      </div>
    </MainLayout>
  )
}
