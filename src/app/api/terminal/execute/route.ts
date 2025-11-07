import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { rateLimit } from '@/lib/rate-limit'

// Rate limiter: 30 requests per minute for terminal execution
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 30,
})

export async function POST(request: NextRequest) {
  return limiter(request, async (req) => {
    return await handlePost(req)
  })
}

async function handlePost(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { command } = body

    if (!command) {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      )
    }

    // Security: Whitelist allowed commands or implement proper authorization
    const allowedCommands = ['ls', 'pwd', 'git', 'npm', 'node', 'echo', 'cat', 'mkdir', 'rm', 'vercel']
    const cmd = command.split(' ')[0]

    if (!allowedCommands.includes(cmd)) {
      return NextResponse.json(
        { error: `Command '${cmd}' is not allowed` },
        { status: 403 }
      )
    }

    return new Promise((resolve) => {
      const [executable, ...args] = command.split(' ')
      const proc = spawn(executable ?? 'echo', args, {
        cwd: process.cwd(),
        env: process.env,
      })

      let stdout = ''
      let stderr = ''

      proc.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      proc.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      proc.on('close', (code) => {
        resolve(
          NextResponse.json({
            stdout,
            stderr,
            exitCode: code,
          })
        )
      })

      proc.on('error', (error) => {
        resolve(
          NextResponse.json(
            { error: error.message },
            { status: 500 }
          )
        )
      })
    })
  } catch (error) {
    console.error('Terminal execute error:', error)
    return NextResponse.json(
      { error: 'Failed to execute command' },
      { status: 500 }
    )
  }
}
