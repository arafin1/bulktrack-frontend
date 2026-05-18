import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Samples from "./pages/Samples"
import BulkOrders from "./pages/BulkOrders"
import Buyers from "./pages/Buyers"
import Styles from "./pages/Styles"
import Users from "./pages/Users"
import Reports from "./pages/Reports"
import Alerts from "./pages/Alerts"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/samples" element={
            <ProtectedRoute roles={["admin", "merchandiser"]}>
              <Samples />
            </ProtectedRoute>
          } />

          <Route path="/bulk-orders" element={
            <ProtectedRoute roles={["admin", "factory", "buyer"]}>
              <BulkOrders />
            </ProtectedRoute>
          } />

          <Route path="/buyers" element={
            <ProtectedRoute roles={["admin", "merchandiser"]}>
              <Buyers />
            </ProtectedRoute>
          } />

          <Route path="/styles" element={
            <ProtectedRoute roles={["admin", "merchandiser"]}>
              <Styles />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute roles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path="/alerts" element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
