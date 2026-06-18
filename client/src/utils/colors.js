const CURSOR_COLORS = [
    { color: '#FF6B6B', light: '#FF6B6B33' },  
    { color: '#4ECDC4', light: '#4ECDC433' },  
    { color: '#45B7D1', light: '#45B7D133' },  
    { color: '#96CEB4', light: '#96CEB433' }, 
    { color: '#FFEAA7', light: '#FFEAA733' }, 
    { color: '#DDA0DD', light: '#DDA0DD33' },  
    { color: '#F08080', light: '#F0808033' },  
    { color: '#98D8C8', light: '#98D8C833' }, 
    { color: '#BB8FCE', light: '#BB8FCE33' },  
    { color: '#85C1E9', light: '#85C1E933' },  
  ]

  export const getUserColor = (userId) => {
    if (!userId) return CURSOR_COLORS[0]
    let hash = 0
    const str = userId.toString()
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % CURSOR_COLORS.length
    return CURSOR_COLORS[index]
}
