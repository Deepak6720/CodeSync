import { create } from "zustand";
import axios from "../utils/axios";

const useRoomStore = create((set) => ({
  rooms: [],
  isLoading: false,
  error: null,

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/rooms");
      set({ rooms: response.data.rooms, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch rooms",
        isLoading: false,
      });
    }
  },

  createRoom: async (name, language) => {
    try {
      const response = await axios.post("/rooms/create", { name, language });
      const newRoom = response.data.room;

      // Add the new room to existing list without re-fetching
      set((state) => ({
        rooms: [
          { ...newRoom, memberCount: 1, userRole: "owner" },
          ...state.rooms,
        ],
      }));

      return { success: true, room: newRoom };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create room",
      };
    }
  },

  joinRoom: async (inviteCode) => {
    try {
      const response = await axios.post("/rooms/join", { inviteCode });
      const joinedRoom = response.data.room;

      // Check if room already in list (already member case)
      set((state) => {
        const exists = state.rooms.find((r) => r._id === joinedRoom._id);
        if (exists) return state;
        return {
          rooms: [
            { ...joinedRoom, memberCount: 1, userRole: "member" },
            ...state.rooms,
          ],
        };
      });

      return { success: true, room: joinedRoom };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to join room",
      };
    }
  },
  deleteRoom: async (roomId) => {
    try {
      await axios.delete(`/rooms/${roomId}`);
      set((state) => ({
        rooms: state.rooms.filter((r) => r._id !== roomId),
      }));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete room",
      };
    }
  },

  updateRoom: async (roomId, data) => {
    try {
      const response = await axios.put(`/rooms/${roomId}`, data);
      const updatedRoom = response.data.room;

      set((state) => ({
        rooms: state.rooms.map((r) =>
          r._id === roomId ? { ...r, ...updatedRoom } : r
        ),
      }));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update room",
      };
    }
  },
}));

export default useRoomStore;
