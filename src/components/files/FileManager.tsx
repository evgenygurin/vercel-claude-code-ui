'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Folder,
  File,
  FileText,
  Image,
  Code,
  Upload,
  Download,
  Trash2,
  Search,
  MoreVertical,
  Plus,
  RefreshCw
} from 'lucide-react'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: Date
  extension?: string
  path: string
}

export function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState('/')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  // Mock file data - in real implementation this would come from fd tool
  useEffect(() => {
    loadFiles()
  }, [currentPath])

  const loadFiles = async () => {
    setIsLoading(true)
    try {
      // Simulate fd tool integration
      const mockFiles: FileItem[] = [
        {
          name: 'components',
          type: 'folder',
          modified: new Date(),
          path: '/src/components'
        },
        {
          name: 'pages',
          type: 'folder',
          modified: new Date(),
          path: '/src/pages'
        },
        {
          name: 'utils.ts',
          type: 'file',
          size: 2048,
          extension: 'ts',
          modified: new Date(),
          path: '/src/lib/utils.ts'
        },
        {
          name: 'package.json',
          type: 'file',
          size: 1536,
          extension: 'json',
          modified: new Date(),
          path: '/package.json'
        },
        {
          name: 'README.md',
          type: 'file',
          size: 1024,
          extension: 'md',
          modified: new Date(),
          path: '/README.md'
        },
        {
          name: 'tailwind.config.js',
          type: 'file',
          size: 2048,
          extension: 'js',
          modified: new Date(),
          path: '/tailwind.config.js'
        }
      ]
      setFiles(mockFiles)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="h-5 w-5 text-blue-500" />
    }

    switch (file.extension) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <Code className="h-5 w-5 text-yellow-500" />
      case 'md':
        return <FileText className="h-5 w-5 text-gray-500" />
      case 'json':
        return <File className="h-5 w-5 text-green-500" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5 text-gray-400" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">File Manager</h2>
          <p className="text-muted-foreground">
            Advanced file management with fd tool integration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadFiles} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Search and Path */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredFiles.length} files
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
          <CardDescription>
            Current path: {currentPath} | Total: {files.length} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors ${
                    selectedFiles.includes(file.path) ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => {
                    if (file.type === 'folder') {
                      setCurrentPath(file.path)
                    } else {
                      setSelectedFiles(prev =>
                        prev.includes(file.path)
                          ? prev.filter(p => p !== file.path)
                          : [...prev, file.path]
                      )
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.type === 'folder' ? 'Folder' : `${file.extension?.toUpperCase()} File`}
                        {file.size && ` • ${formatFileSize(file.size)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {file.modified.toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Actions */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="default">
                  {selectedFiles.length} selected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedFiles.join(', ')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* fd Commands Info */}
      <Card>
        <CardHeader>
          <CardTitle>fd Tool Integration</CardTitle>
          <CardDescription>
            Commands used for file discovery and management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-muted p-2 rounded">
              fd --type f --extension ts --extension tsx
            </div>
            <div className="bg-muted p-2 rounded">
              fd . src --type f | wc -l
            </div>
            <div className="bg-muted p-2 rounded">
              fd --type f --extension json --exec cat
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
