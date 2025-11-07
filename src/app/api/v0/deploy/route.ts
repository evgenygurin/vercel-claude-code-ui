import { NextRequest, NextResponse } from 'next/server'
import { v0Service } from '@/lib/v0-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const result = await v0Service.deployToVercel(projectId)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Failed to deploy to Vercel:', error)
    return NextResponse.json(
      { error: 'Failed to deploy project' },
      { status: 500 }
    )
  }
}
