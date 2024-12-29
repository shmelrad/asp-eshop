import { Link } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import { Button } from "./ui/button"

export default function NavBar() {
  const { token, isAdmin, logout } = useAuthStore()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/" className="font-semibold">
            Home
          </Link>
          {isAdmin && (
            <Link to="/admin/products" className="font-semibold">
              Manage Products
            </Link>
          )}
        </div>
        <div>
          {token ? (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
} 