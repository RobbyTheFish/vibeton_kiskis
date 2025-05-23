import axios from 'axios'

const API_BASE_URL = 'http://localhost/api'

export interface Player {
  id: string
  username: string
}

// Player API
export const createPlayer = async (username: string): Promise<Player> => {
  const response = await axios.post(`${API_BASE_URL}/players/`, {
    username
  })
  return response.data
}

export const getPlayer = async (playerId: string): Promise<Player> => {
  const response = await axios.get(`${API_BASE_URL}/players/${playerId}`)
  return response.data
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
) 