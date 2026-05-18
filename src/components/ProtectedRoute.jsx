import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <i className="ti ti-loader text-emerald-600 text-3xl animate-spin" />
        <p className="text-sm text-gray-400 mt-2">Loading...</p>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/login" />

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="ti ti-lock text-gray-300 text-5xl" />
          <p className="text-lg font-medium text-gray-700 mt-4">
            Access restricted
          </p>
          <p className="text-sm text-gray-400 mt-1">
            You don't have permission to view this page
          </p>
          <Navigate to="/dashboard" />
        </div>
      </div>
    )
  }

  return children
}
