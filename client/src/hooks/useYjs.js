import { useEffect, useRef, useState, useCallback } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'

import { getUserColor } from '../utils/colors'

const useYjs = (roomId, user) => {
  const ydocRef = useRef(null)         
  const providerRef = useRef(null)     
  const bindingRef = useRef(null)      

  const [onlineUsers, setOnlineUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!roomId || !user) return

    const ydoc = new Y.Doc()
    ydocRef.current = ydoc

    const wsUrl = 'ws://localhost:8000'
    const docName = `room-${roomId}`

    const provider = new WebsocketProvider(wsUrl, docName, ydoc)
    providerRef.current = provider

    const userColorObj = getUserColor(user._id || user.id)

    provider.awareness.setLocalStateField('user', {
      id: user._id || user.id,
      name: user.name,
      avatar: user.avatar,
      color: userColorObj.color,       
      colorLight: userColorObj.light,   
    })

    const handleAwarenessChange = () => {

      const states = Array.from(provider.awareness.getStates().values())

      const users = states
        .filter((state) => state.user)  
        .map((state) => state.user)     

      setOnlineUsers(users)
    }
    provider.awareness.on('change', handleAwarenessChange)

    provider.on('status', ({ status }) => {
      setIsConnected(status === 'connected')
      if (status === 'connected') {
        console.log('Yjs connected to room:', docName)
      }
    })

    //CLEANUP
    return () => {
      console.log('Disconnecting Yjs...')
      provider.awareness.off('change', handleAwarenessChange)
      if (bindingRef.current) {
        bindingRef.current.destroy()
        bindingRef.current = null
      }

      provider.disconnect()
      provider.destroy()
      ydoc.destroy()

      ydocRef.current = null
      providerRef.current = null
    }
  }, [roomId, user?._id]) 

  const connectEditor = useCallback((editor,fileId) => {
    if (!ydocRef.current || !providerRef.current || !editor) {
      console.warn('Cannot connect editor — Yjs not ready')
      return
    }

    if (bindingRef.current) {
      bindingRef.current.destroy()
      bindingRef.current = null
    }

    const ytextName = fileId ? `file-${fileId}` : 'monaco'

    const ytext = ydocRef.current.getText(ytextName)

    const binding = new MonacoBinding(
      ytext,                         
      editor.getModel(),              
      new Set([editor]),              
      providerRef.current.awareness   
    )

    bindingRef.current = binding
    console.log(`Monaco bound to file: ${ytextName}`)
  }, [])

  return {
    onlineUsers,    
    isConnected,    
    connectEditor, 
  }
}

export default useYjs