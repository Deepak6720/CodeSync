import { create } from "zustand";
import axios from "../utils/axios";

const useFileStore = create((set, get) => ({
  files: [],
  activeFileId: null,
  isLoading: false,
  isRenaming: null,

  getActiveFile: () => {
    const { files, activeFileId } = get();
    return files.find((f) => f._id === activeFileId) || null;
  },

  fetchFiles: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/files/${roomId}`);
      const files = response.data.files;
      set({ files, isLoading: false });
      if (files.length > 0 && !get().activeFileId) {
        set({ activeFileId: files[0]._id });
      }

      return files;
    } catch (error) {
      console.error("Fetch files error:", error);
      set({ isLoading: false });
      return [];
    }
  },

  setActiveFile: (fileId) => {
    set({ activeFileId: fileId });
  },

  createFile: async (roomId, name) => {
    try {
      const response = await axios.post("/files", { roomId, name });
      const newFile = response.data.file;

      set((state) => ({
        files: [...state.files, newFile],
        activeFileId: newFile._id, // switch to new file
      }));

      return { success: true, file: newFile };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create file",
      };
    }
  },
  renameFile: async (fileId, newName) => {
    try {
      const response = await axios.put(`/files/${fileId}`, { name: newName });
      const updatedFile = response.data.file;

      set((state) => ({
        files: state.files.map((f) =>
          f._id === fileId ? { ...f, ...updatedFile } : f
        ),
        isRenaming: null,
      }));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to rename file",
      };
    }
  },

  deleteFile: async (fileId) => {
    try {
      await axios.delete(`/files/${fileId}`);

      const { files, activeFileId } = get();
      const remainingFiles = files.filter((f) => f._id !== fileId);

      // If deleted file was active, switch to first remaining file
      const newActiveId =
        activeFileId === fileId ? remainingFiles[0]?._id || null : activeFileId;

      set({
        files: remainingFiles,
        activeFileId: newActiveId,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete file",
      };
    }
  },

  saveContent: async (fileId, content) => {
    try {
      await axios.put(`/files/${fileId}`, { content });
    } catch (error) {
      console.error("Save content error:", error);
    }
  },
  startRenaming: (fileId) => set({ isRenaming: fileId }),
  stopRenaming: () => set({ isRenaming: null }),
  clearFiles: () => set({ files: [], activeFileId: null, isRenaming: null }),
}));

export default useFileStore;
