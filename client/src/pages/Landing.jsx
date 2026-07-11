import { useNavigate } from 'react-router-dom'
import {
  Code2, Users, Zap, Shield,
  MessageSquare, History, Play, ArrowRight
} from 'lucide-react'
import useAuthStore from '../store/authStore'

const FEATURES = [
  {
    icon: Users,
    title: 'Real-Time Collaboration',
    description: 'Code together with teammates in real-time. See live cursors and changes as they happen.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Zap,
    title: 'Conflict-Free Sync',
    description: 'Powered by Yjs CRDT — multiple users can edit simultaneously without conflicts.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Play,
    title: 'Run Code Instantly',
    description: 'Execute code in 10+ languages directly in the browser. See output in real-time.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: MessageSquare,
    title: 'Built-in Chat',
    description: 'Discuss code with teammates without leaving the editor. Chat history persists.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: History,
    title: 'Version History',
    description: 'Save snapshots manually or let auto-save handle it. Restore any previous version.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'JWT authentication, rate limiting, and input validation protect your code rooms.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
]

const LANGUAGES = [
  'JavaScript', 'Python', 'C++', 'Java',
  'TypeScript', 'Go', 'Rust', 'SQL'
]

const Landing = () => {
  const navigate = useNavigate()
  const { token } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 size={28} className="text-blue-500" />
            <span className="text-xl font-bold">CodeSync</span>
          </div>

          <div className="flex items-center gap-3">
            {token ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">

        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
          Code Together{' '}
          <span className="text-blue-500">In Real-Time</span>
        </h1>

        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          A collaborative code editor where multiple developers can write, run,
          and discuss code simultaneously — like Google Docs for code.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg"
          >
            Start Coding Free
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg"
          >
            Sign In
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {LANGUAGES.map((lang) => (
            <span
              key={lang}
              className="bg-gray-800 text-gray-400 text-sm px-3 py-1 rounded-full"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Everything you need to code together
          </h2>
          <p className="text-gray-400 text-lg">
            Built with modern technologies for a seamless collaborative experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
              >
                <div className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} className={feature.color} />
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-800">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">Built with Modern Tech</h2>
          <p className="text-gray-400">
            A full-stack project showcasing industry-standard technologies
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'React + Vite', desc: 'Frontend' },
            { name: 'Node.js + Express', desc: 'Backend' },
            { name: 'MongoDB Atlas', desc: 'Database' },
            { name: 'Socket.io', desc: 'Real-time Events' },
            { name: 'Yjs CRDT', desc: 'Collaboration' },
            { name: 'Monaco Editor', desc: 'Code Editor' },
            { name: 'JWT + Bcrypt', desc: 'Authentication' },
            { name: 'JDoodle API', desc: 'Code Execution' },
          ].map((tech) => (
            <div
              key={tech.name}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
            >
              <p className="text-white font-medium text-sm">{tech.name}</p>
              <p className="text-gray-500 text-xs mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to collaborate?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Create a room, share the invite code, and start coding together instantly.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg mx-auto"
          >
            Create Your First Room
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-blue-500" />
            <span className="font-semibold">CodeSync</span>
          </div>
          <p className="text-gray-500 text-sm">
            Built by Deepak Kumar • Real-Time Collaborative Code Editor
          </p>
        </div>
      </footer>

    </div>
  )
}

export default Landing