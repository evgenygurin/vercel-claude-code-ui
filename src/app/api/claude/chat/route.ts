import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit'

// Rate limiter: 20 requests per minute for AI chat
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 20,
})

// This endpoint handles Claude AI chat interactions
export async function POST(request: NextRequest) {
  return limiter(request, async (req) => {
    return await handlePost(req)
  })
}

async function handlePost(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { message, sessionId, model = 'claude-sonnet-4' } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Anthropic API key not configured',
          note: 'Set ANTHROPIC_API_KEY environment variable'
        },
        { status: 500 }
      )
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: 'Failed to get response from Claude', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      response: data.content[0]?.text ?? '',
      model: data.model,
      sessionId,
      usage: data.usage,
    })
  } catch (error) {
    console.error('Claude chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

// Stream endpoint for real-time responses
export async function GET(request: NextRequest) {
  return limiter(request, async (req) => {
    return await handleGet(req)
  })
}

async function handleGet(request: NextRequest): Promise<NextResponse | Response> {
  const message = request.nextUrl.searchParams.get('message')

  if (!message) {
    return NextResponse.json(
      { error: 'Message is required' },
      { status: 400 }
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Anthropic API key not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4',
        max_tokens: 4096,
        stream: true,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    })

    if (!response.ok || !response.body) {
      return NextResponse.json(
        { error: 'Failed to get stream from Claude' },
        { status: response.status }
      )
    }

    // Return streaming response
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Claude stream error:', error)
    return NextResponse.json(
      { error: 'Failed to stream chat message' },
      { status: 500 }
    )
  }
}
