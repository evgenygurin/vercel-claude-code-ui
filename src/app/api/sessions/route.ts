import { NextRequest, NextResponse } from 'next/server'
import { claudeSessionService } from '@/lib/claude-session-service'

export async function GET() {
  try {
    const sessions = await claudeSessionService.getAllSessions()
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, projectId } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Session name is required' },
        { status: 400 }
      )
    }

    const session = await claudeSessionService.createSession(name, description, projectId)
    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
