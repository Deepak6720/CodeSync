import { Code2 } from 'lucide-react'

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto">
            <Code2 size={32} className="text-blue-500" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/30 border-t-blue-500 animate-spin"></div>
        </div>
        <p className="text-gray-400 text-sm">Loading CollabEditor...</p>
      </div>
    </div>
  )
}

export default PageLoader