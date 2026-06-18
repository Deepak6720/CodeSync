import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useRoomStore from '../store/roomStore'
import toast from 'react-hot-toast'

import {
  Plus, LogOut, Copy, Trash2, Users,
  Code2, DoorOpen, Settings
} from 'lucide-react'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { rooms, isLoading, fetchRooms, createRoom, joinRoom, deleteRoom } = useRoomStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomLanguage, setNewRoomLanguage] = useState('javascript')
  const [inviteCode, setInviteCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    if (!newRoomName.trim()) {
      toast.error('Please enter a room name')
      return
    }

    setCreating(true)
    const result = await createRoom(newRoomName.trim(), newRoomLanguage)
    setCreating(false)

    if (result.success) {
      toast.success('Room created! 🎉')
      setShowCreateModal(false)
      setNewRoomName('')
      setNewRoomLanguage('javascript')
    } else {
      toast.error(result.message)
    }
  }

  const handleJoinRoom = async (e) => {
    e.preventDefault()
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code')
      return
    }

    setJoining(true)
    const result = await joinRoom(inviteCode.trim())
    setJoining(false)

    if (result.success) {
      toast.success('Joined room successfully! 🎉')
      setShowJoinModal(false)
      setInviteCode('')
    } else {
      toast.error(result.message)
    }
  }

  const handleDeleteRoom = async (roomId, e) => {
    // Stop click from bubbling up to the room card (which navigates to editor)
    e.stopPropagation()

    if (!window.confirm('Are you sure you want to delete this room?')) return

    setDeletingId(roomId)
    const result = await deleteRoom(roomId)
    setDeletingId(null)

    if (result.success) {
      toast.success('Room deleted')
    } else {
      toast.error(result.message)
    }
  }

  const handleCopyInviteCode = (inviteCode, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(inviteCode)
    toast.success('Invite code copied!')
  }

  const handleEnterRoom = (roomId) => {
    navigate(`/room/${roomId}`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="text-blue-500" size={28} />
            <span className="text-xl font-bold">CollabEditor</span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border-2 border-gray-700"
                />
                <span className="text-gray-300 text-sm hidden sm:block">
                  {user.name}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
  <div>
    <h1 className="text-2xl font-bold">My Rooms</h1>
    <p className="text-gray-400 text-sm mt-1">
      {rooms.length} room{rooms.length !== 1 ? 's' : ''}
    </p>
  </div>

  <div className="flex gap-3">
    <button
      onClick={() => setShowJoinModal(true)}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none justify-center"
    >
      <DoorOpen size={18} />
      Join Room
    </button>
    <button
      onClick={() => setShowCreateModal(true)}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none justify-center"
    >
      <Plus size={18} />
      Create Room
    </button>
  </div>
</div>


        {isLoading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (

          <div className="text-center py-20">
            <Code2 size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-gray-400 text-lg font-medium mb-2">No rooms yet</h3>
            <p className="text-gray-600 text-sm mb-6">
              Create a room to start coding collaboratively
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Create your first room
            </button>
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room._id}
                onClick={() => handleEnterRoom(room._id)}
                className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate pr-2">
                    {room.name}
                  </h3>
                  {room.userRole === 'owner' && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full shrink-0">
                      Owner
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Code2 size={14} />
                  <span className="capitalize">{room.language}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Users size={14} />
                  <span>{room.memberCount} member{room.memberCount !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <button
                    onClick={(e) => handleCopyInviteCode(room.inviteCode, e)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors text-xs"
                  >
                    <Copy size={12} />
                    <span className="font-mono">{room.inviteCode}</span>
                  </button>

                  {room.userRole === 'owner' && (
                    <button
                      onClick={(e) => handleDeleteRoom(room._id, e)}
                      disabled={deletingId === room._id}
                      className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded"
                    >
                      {deletingId === room._id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
  className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md animate-scale-in"
  onClick={(e) => e.stopPropagation()}
>
            <h2 className="text-xl font-bold mb-5">Create New Room</h2>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="My Awesome Project"
                  autoFocus
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Language
                </label>
                <select
                  value={newRoomLanguage}
                  onChange={(e) => setNewRoomLanguage(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  {creating ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setShowJoinModal(false)}
        >
          <div
  className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md animate-scale-in"
  onClick={(e) => e.stopPropagation()}
>
            <h2 className="text-xl font-bold mb-2">Join a Room</h2>
            <p className="text-gray-400 text-sm mb-5">
              Enter the invite code shared by the room owner
            </p>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. F47AC10B"
                  autoFocus
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono tracking-widest text-center text-lg"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joining}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  {joining ? 'Joining...' : 'Join Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard