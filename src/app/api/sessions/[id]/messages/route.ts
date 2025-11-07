import { NextRequest, NextResponse } from 'next/server'
import { claudeSessionService } from '@/lib/claude-session-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await claudeSessionService.getMessages(params.id)
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { role, content, metadata } = body

    if (!role || !content) {
      return NextResponse.json(
        { error: 'Role and content are required' },
        { status: 400 }
      )
    }

    const message = await claudeSessionService.addMessage(params.id, {
      role,
      content,
      metadata,
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Failed to add message:', error)
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cleared = await claudeSessionService.clearMessages(params.id)
    
    if (!cleared) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to clear messages:', error)
    return NextResponse.json(
      { error: 'Failed to clear messages' },
      { status: 500 }
    )
  }
}
