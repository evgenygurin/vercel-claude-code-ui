import dynamic from 'next/dynamic'

export const CodeEditor = dynamic(
  () => import('./CodeEditor').then((mod) => ({ default: mod.CodeEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">Loading Code Editor...</p>
        </div>
      </div>
    ),
  }
)
