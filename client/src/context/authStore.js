import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password, remember) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({ user: data.user, token: data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return true
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed. Please check your credentials.'
          set({ error: msg, isLoading: false })
          return false
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/signup', { name, email, password })
          set({ user: data.user, token: data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return true
        } catch (err) {
          const msg = err.response?.data?.message || 'Signup failed. Please try again.'
          set({ error: msg, isLoading: false })
          return false
        }
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization']
        set({ user: null, token: null, error: null })
      },

      clearError: () => set({ error: null }),

      initAuth: () => {
        const token = get().token
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      }
    }),
    {
      name: 'careerhub-auth',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
)
