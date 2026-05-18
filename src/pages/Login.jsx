import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import API from "../services/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await API.post("/auth/login", { email, password })
      login(res.data.user, res.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-xl p-8 w-full max-w-sm shadow-sm">

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="ti ti-layout-dashboard text-emerald-700 text-2xl" />
          </div>
          <h1 className="text-xl font-medium text-gray-900">BulkTrack</h1>
          <p className="text-sm text-gray-400 mt-1">
            Garments production tracking
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="admin@bulktrack.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs text-gray-500 block mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Made for Bangladesh garments industry 🇧🇩
        </p>
      </div>
    </div>
  )
}
