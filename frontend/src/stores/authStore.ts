import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../services/api'

interface User {
  id: string
  username: string
  score: number
  level: number
}

interface PlayerState {
  user: User | null
  isLoading: boolean
  error: string | null
  createPlayer: (username: string) => Promise<void>
  getPlayer: (username: string) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      createPlayer: async (username: string) => {
        try {
          set({ isLoading: true, error: null })
          const response = await api.post('/players/create-player', { username })
          
          // Get player details
          const userResponse = await api.get(`/players/player/${username}`)
          
          set({
            user: userResponse.data,
            isLoading: false,
            error: null
          })
          
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.detail || 'Failed to create player'
          })
          throw error
        }
      },

      getPlayer: async (username: string) => {
        try {
          set({ isLoading: true, error: null })
          const response = await api.get(`/players/player/${username}`)
          
          set({
            user: response.data,
            isLoading: false,
            error: null
          })
          
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.detail || 'Player not found'
          })
          throw error
        }
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({ 
        user: state.user
      })
    }
  )
) 