import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  try {
    // Get git status
    const { stdout: statusOutput } = await execAsync('git status --porcelain')
    const { stdout: branchOutput } = await execAsync('git branch --show-current')

    // Parse changes
    const changes = statusOutput
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const status = line.substring(0, 2).trim()
        const path = line.substring(3)

        let changeStatus: 'added' | 'modified' | 'deleted' | 'untracked' = 'modified'
        let staged = false

        if (status.includes('A')) {
          changeStatus = 'added'
          staged = true
        } else if (status.includes('M')) {
          changeStatus = 'modified'
          staged = status[0] === 'M'
        } else if (status.includes('D')) {
          changeStatus = 'deleted'
          staged = status[0] === 'D'
        } else if (status === '??') {
          changeStatus = 'untracked'
        }

        return { path, status: changeStatus, staged }
      })

    // Get ahead/behind counts
    let ahead = 0
    let behind = 0
    try {
      const { stdout: revOutput } = await execAsync(
        'git rev-list --left-right --count HEAD...@{upstream}'
      )
      const [aheadStr, behindStr] = revOutput.trim().split('\t')
      ahead = parseInt(aheadStr ?? '0', 10)
      behind = parseInt(behindStr ?? '0', 10)
    } catch {
      // No upstream branch
    }

    return NextResponse.json({
      status: {
        branch: branchOutput.trim(),
        ahead,
        behind,
        changes,
      },
    })
  } catch (error) {
    console.error('Git status error:', error)
    return NextResponse.json(
      { error: 'Failed to get git status' },
      { status: 500 }
    )
  }
}
