'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  RefreshCw,
  GripVertical
} from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: Date
  extension?: string
  path: string
}

// Sortable File Item Component
function SortableFileItem({
  file,
  onClick,
  isSelected,
  getFileIcon,
  formatFileSize
}: {
  file: FileItem
  onClick: () => void
  isSelected: boolean
  getFileIcon: (file: FileItem) => JSX.Element
  formatFileSize: (bytes?: number) => string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors ${
        isSelected ? 'bg-accent border-primary' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
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
  )
}

export function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState('/')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
          id: '1',
          name: 'components',
          type: 'folder',
          modified: new Date(),
          path: '/src/components'
        },
        {
          id: '2',
          name: 'pages',
          type: 'folder',
          modified: new Date(),
          path: '/src/pages'
        },
        {
          id: '3',
          name: 'utils.ts',
          type: 'file',
          size: 2048,
          extension: 'ts',
          modified: new Date(),
          path: '/src/lib/utils.ts'
        },
        {
          id: '4',
          name: 'package.json',
          type: 'file',
          size: 1536,
          extension: 'json',
          modified: new Date(),
          path: '/package.json'
        },
        {
          id: '5',
          name: 'README.md',
          type: 'file',
          size: 1024,
          extension: 'md',
          modified: new Date(),
          path: '/README.md'
        },
        {
          id: '6',
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

  // Drag & Drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // File upload handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles)
    // Here you would normally upload files to server
    console.log('Files dropped:', acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Disable click to open file dialog
    noKeyboard: true
  })

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
            {uploadedFiles.length > 0 && ` | ${uploadedFiles.length} files uploaded`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}>
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here or use the upload button'}
              </p>
            </div>
          </div>

          <ScrollArea className="h-96">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={filteredFiles.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <SortableFileItem
                      key={file.id}
                      file={file}
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
                      isSelected={selectedFiles.includes(file.path)}
                      getFileIcon={getFileIcon}
                      formatFileSize={formatFileSize}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
