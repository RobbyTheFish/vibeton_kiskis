import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as api from '../services/api'

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
          console.log('Creating player with username:', username)
          
          const player = await api.createPlayer(username)
          console.log('Player created:', player)
          
          // Создаем объект пользователя с дополнительными полями
          const user = {
            ...player,
            score: 0,
            level: 1
          }
          
          set({
            user: user,
            isLoading: false,
            error: null
          })
          
        } catch (error: any) {
          console.error('Error creating player:', error)
          set({
            isLoading: false,
            error: error.response?.data?.detail || error.message || 'Failed to create player'
          })
          throw error
        }
      },

      getPlayer: async (playerId: string) => {
        try {
          set({ isLoading: true, error: null })
          const player = await api.getPlayer(playerId)
          
          // Создаем объект пользователя с дополнительными полями
          const user = {
            ...player,
            score: 0,
            level: 1
          }
          
          set({
            user: user,
            isLoading: false,
            error: null
          })
          
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.detail || error.message || 'Player not found'
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