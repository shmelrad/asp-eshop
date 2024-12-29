import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin }: ProtectedRouteProps) {
  const { token, isAdmin } = useAuthStore()

  if (!token) return <Navigate to="/login" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}