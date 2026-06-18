import { useEffect, useRef } from 'react'
import socket from '../socket'
import toast from 'react-hot-toast'
import useEditorStore from '../store/editorStore'
import useChatStore from '../store/chatStore' 

const useSocket = (roomId, user) => {
  const listenersSet = useRef(false)

  useEffect(() => {
    if (!roomId || !user) return
    socket.connect()
    socket.emit('join-room', {
      roomId,
      user: {
        id: user._id || user.id,
        name: user.name,
        avatar: user.avatar,
      },
    })

    if (!listenersSet.current) {
      listenersSet.current = true

      socket.on('user-joined', ({ name }) => {
        toast.success(`${name} joined the room 👋`, {
          duration: 3000,
          icon: '🟢',
        })
      })

      socket.on('user-left', ({ name }) => {
        toast(`${name} left the room`, {
          duration: 3000,
          icon: '🔴',
        })
      })

      socket.on('language-changed', ({ language, changedBy }) => {
        useEditorStore.getState().setLanguage(language)

        toast(`${changedBy} switched to ${language}`, {
          icon: '🔤',
          duration: 2000,
        })
      })

      socket.on('execution-result', (result) => {
        useEditorStore.getState().setOutput(result)
        useEditorStore.getState().setIsRunning(false)
      })
      socket.on('receive-chat-message', (message) => {
        useChatStore.getState().addMessage(message)
      })
    }

    //CLEANUP 
    return () => {
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('language-changed')
      socket.off('execution-result')
      socket.off('receive-chat-message')
      socket.disconnect()
      listenersSet.current = false
       useChatStore.getState().clearMessages()
    }

  }, [roomId, user?._id])

  const emitLanguageChange = (language) => {
    socket.emit('language-change', {
      roomId,
      language,
      changedBy: user?.name,
    })
  }

  const emitCodeExecutionResult = (result) => {
    socket.emit('code-execution-result', {
      roomId,
      result,
    })
  }

  const emitChatMessage = (content) => {
    if (!content.trim()) return

    const tempId = `temp-${Date.now()}`
    const tempMessage = {
      tempId,
      _id: tempId,
      roomId,
      senderId: user._id || user.id,
      content: content.trim(),
      senderName: user.name,
      senderAvatar: user.avatar,
      createdAt: new Date().toISOString(),
      isOptimistic: true, 
    }

    useChatStore.getState().addOptimisticMessage(tempMessage)

    socket.emit('send-chat-message', {
      roomId,
      message: {
        senderId: user._id || user.id,
        content: content.trim(),
        senderName: user.name,
        senderAvatar: user.avatar,
        tempId,
      },
    })
  }

  return {
    emitLanguageChange,
    emitCodeExecutionResult,
    emitChatMessage, 
  }
}

export default useSocket