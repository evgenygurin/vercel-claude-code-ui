import { NextRequest, NextResponse } from 'next/server'
import { v0Service } from '@/lib/v0-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, context, framework, style } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const result = await v0Service.generateComponent({
      prompt,
      context,
      framework: framework || 'react',
      style: style || 'tailwind',
    })

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Failed to generate with v0:', error)
    return NextResponse.json(
      { error: 'Failed to generate component' },
      { status: 500 }
    )
  }
}
