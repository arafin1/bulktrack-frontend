import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const navItems = {
  admin: [
    { icon: "ti-home", label: "Dashboard", path: "/dashboard" },
    { icon: "ti-shirt", label: "Samples", path: "/samples" },
    { icon: "ti-package", label: "Bulk orders", path: "/bulk-orders" },
    { icon: "ti-users", label: "Buyers", path: "/buyers" },
    { icon: "ti-palette", label: "Styles", path: "/styles" },
    { icon: "ti-chart-bar", label: "Reports", path: "/reports" },
    { icon: "ti-user-cog", label: "Users", path: "/users" },
    { icon: "ti-bell", label: "Alerts", path: "/alerts" },
  ],
  merchandiser: [
    { icon: "ti-home", label: "Dashboard", path: "/dashboard" },
    { icon: "ti-shirt", label: "Samples", path: "/samples" },
    { icon: "ti-users", label: "Buyers", path: "/buyers" },
    { icon: "ti-palette", label: "Styles", path: "/styles" },
    { icon: "ti-bell", label: "Alerts", path: "/alerts" },
  ],
  factory: [
    { icon: "ti-home", label: "Dashboard", path: "/dashboard" },
    { icon: "ti-package", label: "My orders", path: "/bulk-orders" },
    { icon: "ti-bell", label: "Alerts", path: "/alerts" },
  ],
  buyer: [
    { icon: "ti-shirt", label: "My samples", path: "/dashboard" },
    { icon: "ti-package", label: "My orders", path: "/bulk-orders" },
    { icon: "ti-bell", label: "Notifications", path: "/alerts" },
  ],
}

const roleBadge = {
  admin: { bg: "bg-emerald-50", text: "text-emerald-800", label: "owner" },
  merchandiser: { bg: "bg-amber-50", text: "text-amber-800", label: "merch" },
  factory: { bg: "bg-blue-50", text: "text-blue-800", label: "production" },
  buyer: { bg: "bg-purple-50", text: "text-purple-800", label: "buyer" },
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const items = navItems[user?.role] || []
  const badge = roleBadge[user?.role] || {}

  return (
    <div className="w-48 bg-gray-50 border-r border-gray-100 flex flex-col p-4 gap-1 min-h-screen fixed left-0 top-0">

      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center">
          <i className="ti ti-layout-dashboard text-emerald-700 text-sm" />
        </div>
        <span className="text-sm font-medium">BulkTrack</span>
      </div>

      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            location.pathname === item.path
              ? "bg-white text-gray-900 font-medium border border-gray-100 shadow-sm"
              : "text-gray-500 hover:text-gray-800 hover:bg-white"
          }`}
        >
          <i className={`ti ${item.icon} text-base`} />
          {item.label}
        </Link>
      ))}

      <div className="flex-1" />

      <div className="border-t border-gray-100 pt-3 mt-2">
        <div className="flex items-center gap-2 px-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-medium truncate w-24">
              {user?.name}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <i className="ti ti-logout text-base" />
          Logout
        </button>
      </div>
    </div>
  )
}
