import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
  token: string | null
  isAdmin: boolean
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<{ role: string }>(token)
      setIsAdmin(decoded.role === 'Admin')
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
      setIsAdmin(false)
    }
  }, [token])

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        isAdmin,
        login: setToken,
        logout: () => setToken(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}