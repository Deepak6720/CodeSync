import { create } from 'zustand'
import axios from '../utils/axios'

const useSnapshotStore = create((set, get) => ({
  snapshots: [],
  isLoading: false,
  isSaving: false,
  isHistoryOpen: false,  
  toggleHistory: () => {
    set((state) => ({ isHistoryOpen: !state.isHistoryOpen }))
  },

  fetchSnapshots: async (roomId, fileId) => {
    set({ isLoading: true })
    try {
      const params = fileId ? { fileId } : {}
      const response = await axios.get(`/snapshots/${roomId}`, { params })
      set({ snapshots: response.data.snapshots, isLoading: false })
    } catch (error) {
      console.error('Fetch snapshots error:', error)
      set({ isLoading: false })
    }
  },
  saveSnapshot: async ({ roomId, fileId, code, saveType }) => {
    set({ isSaving: true })
    try {
      const response = await axios.post('/snapshots', {
        roomId,
        fileId,
        code,
        saveType: saveType || 'manual',
      })

      const newSnapshot = response.data.snapshot

      // Add to beginning of list (newest first)
      set((state) => ({
        snapshots: [newSnapshot, ...state.snapshots].slice(0, 20),
        isSaving: false,
      }))

      return { success: true }
    } catch (error) {
      set({ isSaving: false })
      return { success: false }
    }
  },

  // Restore a snapshot — returns the code to load into editor
  restoreSnapshot: async (snapshotId) => {
    try {
      const response = await axios.post(`/snapshots/${snapshotId}/restore`)
      return {
        success: true,
        code: response.data.code,
        fileId: response.data.fileId,
      }
    } catch (error) {
      return { success: false }
    }
  },

  clearSnapshots: () => set({ snapshots: [], isHistoryOpen: false }),
}))

export default useSnapshotStore