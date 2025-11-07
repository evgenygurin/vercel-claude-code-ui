import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { rateLimit, requireApiKey } from '@/lib/rate-limit'

// Rate limiter: 10 requests per minute for script execution (stricter due to security)
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 10,
})

export async function POST(request: NextRequest) {
  // Require API key for script execution if configured
  if (process.env.REQUIRE_SCRIPT_AUTH === 'true') {
    return requireApiKey(async (req) => {
      return limiter(req, async (r) => {
        return await handlePost(r)
      })
    })(request)
  }

  return limiter(request, async (req) => {
    return await handlePost(req)
  })
}

async function handlePost(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { script, language = 'bash', args = [] } = body

    if (!script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      )
    }

    // Create temporary directory for script
    const tempDir = join(tmpdir(), 'claude-code-ui-scripts')
    await mkdir(tempDir, { recursive: true })

    // Determine file extension and interpreter
    const extensions: Record<string, { ext: string; cmd: string }> = {
      bash: { ext: 'sh', cmd: 'bash' },
      shell: { ext: 'sh', cmd: 'sh' },
      python: { ext: 'py', cmd: 'python3' },
      node: { ext: 'js', cmd: 'node' },
      javascript: { ext: 'js', cmd: 'node' },
      typescript: { ext: 'ts', cmd: 'ts-node' },
    }

    const config = extensions[language.toLowerCase()] ?? extensions.bash!
    const scriptPath = join(tempDir, `script-${Date.now()}.${config.ext}`)

    // Write script to file
    await writeFile(scriptPath, script, 'utf-8')

    return new Promise((resolve) => {
      const proc = spawn(config.cmd, [scriptPath, ...args], {
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
            scriptPath,
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

      // Timeout after 30 seconds
      setTimeout(() => {
        proc.kill()
        resolve(
          NextResponse.json(
            { error: 'Script execution timeout' },
            { status: 408 }
          )
        )
      }, 30000)
    })
  } catch (error) {
    console.error('Script execution error:', error)
    return NextResponse.json(
      { error: 'Failed to execute script' },
      { status: 500 }
    )
  }
}
