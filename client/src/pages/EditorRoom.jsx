import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

import EditorActions from '../components/Editor/EditorActions'
import StatusBar from '../components/Editor/StatusBar'
import KeyboardShortcuts from '../components/UI/KeyboardShortcuts'


import CodeEditor from '../components/Editor/CodeEditor'
import EditorToolbar from '../components/Editor/EditorToolbar'
import OutputPanel from '../components/Editor/OutputPanel'
import FileExplorer from '../components/FileExplorer/FileExplorer'
import FileTabs from '../components/Editor/FileTabs'
import OnlineUsers from '../components/Editor/OnlineUsers'
import ChatPanel from '../components/Chat/ChatPanel'
import ChatToggleButton from '../components/Chat/ChatToggleButton'
import VersionHistory from '../components/Editor/VersionHistory' 

import useEditorStore from '../store/editorStore'
import useAuthStore from '../store/authStore'
import useRoomStore from '../store/roomStore'
import useFileStore from '../store/fileStore'
import useChatStore from '../store/chatStore'
import useSnapshotStore from '../store/snapshotStore'         
import useYjs from '../hooks/useYjs'
import useSocket from '../hooks/useSocket'
import axios from '../utils/axios'

const EditorRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const { user } = useAuthStore()
  const { rooms, fetchRooms } = useRoomStore()
  const {
    language, showOutput,
    setIsRunning, setOutput,
    toggleOutput, initEditor, setLanguage,
  } = useEditorStore()

  const {
    files, activeFileId,
    fetchFiles, setActiveFile,
    clearFiles, getActiveFile,
  } = useFileStore()

  const { fetchMessages, clearMessages } = useChatStore()
  const {
    fetchSnapshots,
    saveSnapshot,
    restoreSnapshot,
    clearSnapshots,
    isHistoryOpen,
  } = useSnapshotStore()

  const [currentRoom, setCurrentRoom] = useState(null)
  const editorRef = useRef(null)
  const autoSaveRef = useRef(null)  

  const { onlineUsers, isConnected, connectEditor } = useYjs(roomId, user)
  const { emitLanguageChange, emitCodeExecutionResult, emitChatMessage } =
    useSocket(roomId, user)
  useEffect(() => {
    const loadRoom = async () => {
      let roomList = rooms
      if (rooms.length === 0) {
        await fetchRooms()
        roomList = useRoomStore.getState().rooms
      }
      const room = roomList.find((r) => r._id === roomId)
      if (room) {
        setCurrentRoom(room)
        initEditor(room.language)
      }

      const roomFiles = await fetchFiles(roomId)

      if (roomFiles.length === 0 && room) {
        const ext = getDefaultExtension(room.language)
        await useFileStore.getState().createFile(roomId, `main.${ext}`)
      }

      await fetchMessages(roomId)

      await fetchSnapshots(roomId)
    }

    loadRoom()

    autoSaveRef.current = setInterval(() => {
      handleAutoSave()
    }, 3 * 60 * 1000) 

    return () => {
      clearFiles()
      clearMessages()
      clearSnapshots()
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current)
      }
    }
  }, [roomId])

  useEffect(() => {
    const activeFile = getActiveFile()
    if (activeFile) {
      setLanguage(activeFile.language)
      // Refresh snapshots when switching files
      if (roomId) fetchSnapshots(roomId, activeFile._id)
    }
  }, [activeFileId])

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor

    const activeFile = getActiveFile()
    connectEditor(editor, activeFile?._id)
    // Ctrl+S / Cmd+S keyboard shortcut to save snapshot
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        handleSave('manual')
      }
    )
    toast.success(
      `Joined room! ${isConnected ? '🟢 Live' : '🟡 Connecting...'}`,
      { duration: 2000 }
    )
  }

  const handleFileSelect = useCallback((file) => {
    setLanguage(file.language)
    if (editorRef.current) {
      connectEditor(editorRef.current, file._id)
    }
    fetchSnapshots(roomId, file._id)
  }, [connectEditor, setLanguage, roomId])

  const handleSave = async (saveType = 'manual') => {
    const code = editorRef.current?.getValue()
    const activeFile = getActiveFile()

    if (!activeFile) {
      toast.error('No active file to save')
      return
    }

    const result = await saveSnapshot({
      roomId,
      fileId: activeFile._id,
      code: code || '',
      saveType,
    })

    if (result.success) {
      if (saveType === 'manual') {
        toast.success('Version saved! 📸', { duration: 2000 })
      }
    } else {
      if (saveType === 'manual') {
        toast.error('Failed to save version')
      }
    }
  }
  const handleAutoSave = () => {
    // Only auto-save if editor has content
    const code = editorRef.current?.getValue()
    if (code && code.trim()) {
      handleSave('auto')
    }
  }

  const handleRestore = async (snapshot) => {
    if (!window.confirm(
      `Restore to version saved by ${snapshot.savedByName}?\n\nThis will overwrite the current editor content for all users.`
    )) return

    const result = await restoreSnapshot(snapshot._id)

    if (result.success) {
      if (editorRef.current) {
        editorRef.current.setValue(result.code)
      }
      toast.success('Version restored successfully! ✅')
    } else {
      toast.error('Failed to restore version')
    }
  }

  const handleRun = async () => {
    const code = editorRef.current?.getValue()
    if (!code?.trim()) {
      toast.error('Write some code first!')
      return
    }

    setIsRunning(true)
    if (!showOutput) toggleOutput()

    try {
      const response = await axios.post('/execute', { code, language })
      const result = response.data

      setOutput(result)
      setIsRunning(false)
      emitCodeExecutionResult(result)

      if (result.status?.id === 3) {
        toast.success('Code executed successfully! ✅')
      } else {
        toast.error('Code has errors. Check output panel.')
      }
    } catch (error) {
      setIsRunning(false)
      setOutput({
        stdout: '',
        stderr: error.response?.data?.message || 'Execution failed.',
        compile_output: '',
        time: '0',
        status: { id: 0, description: 'Error' },
      })
      toast.error('Failed to execute code.')
    }
  }

  const handleCopyCode = () => {
    if (currentRoom?.inviteCode) {
      navigator.clipboard.writeText(currentRoom.inviteCode)
      toast.success('Invite code copied!')
    }
  }

  const activeFile = getActiveFile()

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">

      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <ArrowLeft size={20} />
          </button>
  
          <div>
            <h1 className="text-white font-semibold text-sm">
              {currentRoom?.name || 'Loading...'}
            </h1>
  
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-xs capitalize">
                {activeFile?.language || language}
              </p>
  
              <span
                className={`text-xs ${
                  isConnected ? 'text-green-400' : 'text-yellow-400'
                }`}
              >
                {isConnected ? '● Live' : '● Connecting...'}
              </span>
            </div>
          </div>
        </div>
  
        <div className="flex items-center gap-3">
          {currentRoom?.inviteCode && (
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Copy size={13} className="text-gray-400" />
              <span className="font-mono text-xs text-gray-300">
                {currentRoom.inviteCode}
              </span>
            </button>
          )}
  
          <ChatToggleButton />
          <OnlineUsers users={onlineUsers} isConnected={isConnected} />
  
          {user && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full border border-gray-700"
            />
          )}
        </div>
      </nav>

      <EditorToolbar
        roomName={currentRoom?.name}
        onRun={handleRun}
        onLanguageChange={emitLanguageChange}
        onSave={() => handleSave('manual')}
      />

      <div className="flex flex-1 overflow-hidden">
  
        <FileExplorer
          roomName={currentRoom?.name}
          onFileSelect={handleFileSelect}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center border-b border-gray-800 shrink-0">
            <div className="flex-1 overflow-x-auto">
              <FileTabs onFileSelect={handleFileSelect} />
            </div>
            <div className="flex items-center gap-2 px-3 border-l border-gray-800 shrink-0">
              <EditorActions
                getCode={() => editorRef.current?.getValue()}
                fileName={activeFile?.name || 'code.txt'}
              />
              <KeyboardShortcuts />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor onMount={handleEditorMount} />
          </div>
  
          <StatusBar
            getCode={() => editorRef.current?.getValue()}
            language={activeFile?.language || language}
            fileName={activeFile?.name || 'main.js'}
          />
  
          <OutputPanel />
        </div>
        <ChatPanel onSendMessage={emitChatMessage} />
        <VersionHistory onRestore={handleRestore} />
  
      </div>
    </div>
  )
}

const getDefaultExtension = (language) => {
  const map = {
    javascript: 'js', python: 'py', cpp: 'cpp',
    java: 'java', typescript: 'ts', go: 'go',
    rust: 'rs', html: 'html', css: 'css', sql: 'sql',
  }
  return map[language] || 'js'
}

export default EditorRoom