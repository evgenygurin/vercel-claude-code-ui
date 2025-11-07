import dynamic from 'next/dynamic'

export const FileManager = dynamic(
  () => import('./FileManager').then((mod) => ({ default: mod.FileManager })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">Loading File Manager...</p>
        </div>
      </div>
    ),
  }
)
