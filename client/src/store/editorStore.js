import { create } from 'zustand'
import { getLanguage } from '../utils/languages'

const useEditorStore = create((set, get) => ({
  code: '',
  language: 'javascript',
  theme: 'vs-dark',
  output: null,
  isRunning: false,
  showOutput: false,
  activeFile: null,
  setCode: (code) => set({ code }),
  setLanguage: (language) => {
    const lang = getLanguage(language)
    set({
      language,
      code: lang.defaultCode,
    })
  },
  toggleTheme: () => {
    const current = get().theme
    set({ theme: current === 'vs-dark' ? 'light' : 'vs-dark' })
  },
  setTheme: (theme) => set({ theme }),
  initEditor: (language) => {
    const lang = getLanguage(language)
    set({
      language,
      code: lang.defaultCode,
    })
  },
  setOutput: (output) => set({ output, showOutput: true }),
  toggleOutput: () => set((state) => ({ showOutput: !state.showOutput })),
  setIsRunning: (isRunning) => set({ isRunning }),
}))

export default useEditorStore