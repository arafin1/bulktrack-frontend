import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Layout from "../components/layout/Layout"
import API from "../services/api"

function MetricCard({ label, value, color, icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">{label}</p>
        <i className={`ti ${icon} text-base text-gray-400`} />
      </div>
      <p className={`text-2xl font-medium ${color || "text-gray-900"}`}>
        {value}
      </p>
    </div>
  )
}

function Badge({ status }) {
  const styles = {
    approved: "bg-green-50 text-green-800",
    pending: "bg-amber-50 text-amber-800",
    rejected: "bg-red-50 text-red-800",
    submitted: "bg-blue-50 text-blue-800",
    revised: "bg-teal-50 text-teal-800",
    resubmitted: "bg-blue-50 text-blue-800",
    not_started: "bg-gray-100 text-gray-600",
    in_progress: "bg-blue-50 text-blue-800",
    completed: "bg-green-50 text-green-800",
    delayed: "bg-red-50 text-red-800",
    shipped: "bg-teal-50 text-teal-800",
  }
  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status?.replace("_", " ")}
    </span>
  )
}

function AdminDashboard({ data }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total samples" value={data.samples?.total || 0} icon="ti-shirt" />
        <MetricCard label="Approved" value={data.samples?.approved || 0} color="text-green-700" icon="ti-check" />
        <MetricCard label="Bulk orders" value={data.bulk_orders?.total || 0} icon="ti-package" />
        <MetricCard label="Delayed" value={data.bulk_orders?.delayed || 0} color="text-red-600" icon="ti-alert-triangle" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-medium mb-4">Sample status</p>
          {[
            { label: "Approved", value: data.samples?.approved || 0, total: data.samples?.total || 1, color: "bg-green-500" },
            { label: "Pending", value: data.samples?.pending || 0, total: data.samples?.total || 1, color: "bg-amber-400" },
            { label: "Rejected", value: data.samples?.rejected || 0, total: data.samples?.total || 1, color: "bg-red-400" },
            { label: "Revised", value: data.samples?.revised || 0, total: data.samples?.total || 1, color: "bg-blue-400" },
          ].map((item) => (
            <div key={item.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${Math.round((item.value / item.total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-medium mb-4">Production status</p>
          {[
            { label: "Not started", value: data.bulk_orders?.not_started || 0, color: "bg-gray-300" },
            { label: "In progress", value: data.bulk_orders?.in_progress || 0, color: "bg-blue-400" },
            { label: "Completed", value: data.bulk_orders?.completed || 0, color: "bg-green-500" },
            { label: "Delayed", value: data.bulk_orders?.delayed || 0, color: "bg-red-400" },
            { label: "Shipped", value: data.bulk_orders?.shipped || 0, color: "bg-teal-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {data.buyers_summary && (
        <div className="border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-medium mb-4">Buyers summary</p>
          <div className="space-y-2">
            {data.buyers_summary.map((buyer) => (
              <div key={buyer.buyer} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{buyer.buyer}</p>
                  <p className="text-xs text-gray-400">{buyer.country} · {buyer.total_styles} styles</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{buyer.total_bulk_orders} orders</p>
                  {buyer.delayed_orders > 0 && (
                    <p className="text-xs text-red-500">{buyer.delayed_orders} delayed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function MerchandiserDashboard({ data }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard label="Total samples" value={data.samples?.total || 0} icon="ti-shirt" />
        <MetricCard label="Awaiting approval" value={data.samples?.pending || 0} color="text-amber-600" icon="ti-clock" />
        <MetricCard label="Approved" value={data.samples?.approved || 0} color="text-green-700" icon="ti-check" />
      </div>
      <div className="border border-gray-100 rounded-xl p-4 mb-4 bg-amber-50">
        <div className="flex items-center gap-2 text-amber-700">
          <i className="ti ti-lock text-base" />
          <p className="text-sm">Bulk orders — admin access only</p>
        </div>
      </div>
      <div className="border border-gray-100 rounded-xl p-4 bg-amber-50">
        <div className="flex items-center gap-2 text-amber-700">
          <i className="ti ti-lock text-base" />
          <p className="text-sm">Reports — admin access only</p>
        </div>
      </div>
    </>
  )
}

function FactoryDashboard({ data }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard label="Active orders" value={data.bulk_orders?.in_progress || 0} icon="ti-package" />
        <MetricCard label="Not started" value={data.bulk_orders?.not_started || 0} color="text-amber-600" icon="ti-clock" />
        <MetricCard label="Delayed" value={data.bulk_orders?.delayed || 0} color="text-red-600" icon="ti-alert-triangle" />
      </div>
      <div className="border border-gray-100 rounded-xl p-4 mb-4 bg-blue-50">
        <div className="flex items-center gap-2 text-blue-700">
          <i className="ti ti-lock text-base" />
          <p className="text-sm">Samples — merchandiser access only</p>
        </div>
      </div>
      <div className="border border-gray-100 rounded-xl p-4 bg-blue-50">
        <div className="flex items-center gap-2 text-blue-700">
          <i className="ti ti-lock text-base" />
          <p className="text-sm">Buyers — admin access only</p>
        </div>
      </div>
    </>
  )
}

function BuyerDashboard({ data }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard label="My samples" value={data.samples?.total || 0} icon="ti-shirt" />
        <MetricCard label="Pending review" value={data.samples?.pending || 0} color="text-amber-600" icon="ti-clock" />
        <MetricCard label="Approved" value={data.samples?.approved || 0} color="text-green-700" icon="ti-check" />
      </div>
      <div className="border border-gray-100 rounded-xl p-4 bg-purple-50">
        <div className="flex items-center gap-2 text-purple-700">
          <i className="ti ti-lock text-base" />
          <p className="text-sm">Other buyers data — restricted</p>
        </div>
      </div>
    </>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const roleLabels = {
    admin: { label: "Admin", bg: "bg-emerald-50", text: "text-emerald-700" },
    merchandiser: { label: "Merchandiser", bg: "bg-amber-50", text: "text-amber-700" },
    factory: { label: "Factory", bg: "bg-blue-50", text: "text-blue-700" },
    buyer: { label: "Buyer", bg: "bg-purple-50", text: "text-purple-700" },
  }

  const role = roleLabels[user?.role] || {}

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Welcome back, {user?.name}
            </p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${role.bg} ${role.text}`}>
            {role.label}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-400">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {user?.role === "admin" && <AdminDashboard data={data} />}
            {user?.role === "merchandiser" && <MerchandiserDashboard data={data} />}
            {user?.role === "factory" && <FactoryDashboard data={data} />}
            {user?.role === "buyer" && <BuyerDashboard data={data} />}
          </>
        )}
      </div>
    </Layout>
  )
}
