import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path } = body

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      )
    }

    await execAsync(`git add "${path}"`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Git stage error:', error)
    return NextResponse.json(
      { error: 'Failed to stage file' },
      { status: 500 }
    )
  }
}
