export const formatMessageTime = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)

    const diffSeconds = Math.floor((now - date) / 1000)
  
    if (diffSeconds < 10) return 'just now'
    if (diffSeconds < 60) return `${diffSeconds}s ago`

    const diffMinutes = Math.floor(diffSeconds / 60)
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
