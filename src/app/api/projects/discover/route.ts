import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

interface Project {
  id: string
  name: string
  path: string
  lastModified: Date
  type: 'claude' | 'cursor' | 'vscode'
}

async function discoverClaudeProjects(): Promise<Project[]> {
  const projects: Project[] = []
  const claudeProjectsPath = join(homedir(), '.claude', 'projects')

  try {
    const entries = await readdir(claudeProjectsPath, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projectPath = join(claudeProjectsPath, entry.name)
        const stats = await stat(projectPath)

        projects.push({
          id: entry.name,
          name: entry.name,
          path: projectPath,
          lastModified: stats.mtime,
          type: 'claude',
        })
      }
    }
  } catch (error) {
    console.error('Failed to discover Claude projects:', error)
  }

  return projects
}

async function discoverLocalProjects(): Promise<Project[]> {
  const projects: Project[] = []

  // Common project directories
  const searchDirs = [
    join(homedir(), 'Projects'),
    join(homedir(), 'Documents'),
    join(homedir(), 'Desktop'),
    '/Users/laptop/vercel-claude-code-ui',
  ]

  for (const searchDir of searchDirs) {
    try {
      const entries = await readdir(searchDir, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = join(searchDir, entry.name)

          // Check for project indicators
          try {
            const files = await readdir(projectPath)
            const hasPackageJson = files.includes('package.json')
            const hasGit = files.includes('.git')

            if (hasPackageJson || hasGit) {
              const stats = await stat(projectPath)

              projects.push({
                id: entry.name,
                name: entry.name,
                path: projectPath,
                lastModified: stats.mtime,
                type: 'vscode',
              })
            }
          } catch {
            // Skip if can't read directory
          }
        }
      }
    } catch (error) {
      // Skip if directory doesn't exist or can't be read
    }
  }

  return projects
}

export async function GET() {
  try {
    const claudeProjects = await discoverClaudeProjects()
    const localProjects = await discoverLocalProjects()

    const allProjects = [...claudeProjects, ...localProjects]
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
      .slice(0, 50) // Limit to 50 most recent projects

    return NextResponse.json({
      projects: allProjects,
      count: allProjects.length,
    })
  } catch (error) {
    console.error('Project discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover projects' },
      { status: 500 }
    )
  }
}
