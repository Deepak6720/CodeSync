import { create } from "zustand";
import axios from "../utils/axios";

const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  isChatOpen: false,
  unreadCount: 0,

  toggleChat: () => {
    const isOpen = get().isChatOpen;
    set({
      isChatOpen: !isOpen,
      unreadCount: isOpen ? get().unreadCount : 0,
    });
  },

  fetchMessages: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/rooms/${roomId}/messages`);
      set({ messages: response.data.messages, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      set({ isLoading: false });
    }
  },

  // Add a new message (called when Socket.io receives message)
  addMessage: (message) => {
    set((state) => {
      const exists = state.messages.find(
        (m) => m._id === message._id || m.tempId === message.tempId
      );
      if (exists) {
        // Replace temp message with real one from server
        return {
          messages: state.messages.map((m) =>
            m.tempId === message.tempId ? message : m
          ),
        };
      }
      const unreadCount = state.isChatOpen ? 0 : state.unreadCount + 1;

      return {
        messages: [...state.messages, message],
        unreadCount,
      };
    });
  },

  addOptimisticMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => {
    set({ messages: [], unreadCount: 0 });
  },

  clearUnread: () => set({ unreadCount: 0 }),
}));

export default useChatStore;
