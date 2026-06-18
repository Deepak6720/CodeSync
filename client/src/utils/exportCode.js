export const exportCodeAsFile = (code, fileName) => {
    if (!code) return

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName || 'code.txt'
  
    // Must append to DOM for Firefox compatibility
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }