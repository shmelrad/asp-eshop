import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface AuthState {
  token: string | null
  isAdmin: boolean
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token')
  
  return {
    token,
    isAdmin: checkIsAdmin(token),
    login: (token) => {
      localStorage.setItem('token', token)
      set({ token, isAdmin: checkIsAdmin(token) })
    },
    logout: () => {
      localStorage.removeItem('token')
      set({ token: null, isAdmin: false })
    }
  }
})

function checkIsAdmin(token: string | null) {
  if (!token) return false
  try {
    const decoded = jwtDecode<{ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string }>(token)
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin'
  } catch {
    return false
  }
} 