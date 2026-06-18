import { useNavigate } from 'react-router-dom'
import { Code2, Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        <div className="relative mb-8">
          <p className="text-[120px] font-bold text-gray-800 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Code2 size={32} className="text-blue-400" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Maybe you followed a broken link?
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors font-medium text-sm"
          >
            <Home size={16} />
            Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound