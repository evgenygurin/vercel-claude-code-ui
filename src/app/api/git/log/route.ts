import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') ?? '20'

    const { stdout } = await execAsync(
      `git log -${limit} --pretty=format:"%H|%s|%an|%ar"`
    )

    const commits = stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [hash, message, author, date] = line.split('|')
        return {
          hash: hash?.substring(0, 7) ?? '',
          message: message ?? '',
          author: author ?? '',
          date: date ?? '',
        }
      })

    return NextResponse.json({ commits })
  } catch (error) {
    console.error('Git log error:', error)
    return NextResponse.json(
      { error: 'Failed to get git log' },
      { status: 500 }
    )
  }
}
