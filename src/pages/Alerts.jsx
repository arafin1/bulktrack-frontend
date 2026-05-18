import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import API from "../services/api"

export default function Alerts() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const alerts = []

  if (data) {
    if (data.bulk_orders?.delayed > 0) {
      alerts.push({
        id: 1,
        type: "error",
        icon: "ti-alert-triangle",
        title: "Delayed bulk orders",
        message: `${data.bulk_orders.delayed} order(s) are delayed and need attention`,
        color: "bg-red-50 border-red-100",
        iconColor: "text-red-500",
      })
    }

    if (data.samples?.rejected > 0) {
      alerts.push({
        id: 2,
        type: "warning",
        icon: "ti-x",
        title: "Rejected samples",
        message: `${data.samples.rejected} sample(s) rejected by buyer — revision needed`,
        color: "bg-amber-50 border-amber-100",
        iconColor: "text-amber-500",
      })
    }

    if (data.samples?.pending > 0) {
      alerts.push({
        id: 3,
        type: "info",
        icon: "ti-clock",
        title: "Pending approvals",
        message: `${data.samples.pending} sample(s) waiting for buyer approval`,
        color: "bg-blue-50 border-blue-100",
        iconColor: "text-blue-500",
      })
    }

    if (data.bulk_orders?.not_started > 0) {
      alerts.push({
        id: 4,
        type: "warning",
        icon: "ti-player-pause",
        title: "Orders not started",
        message: `${data.bulk_orders.not_started} order(s) have not started production yet`,
        color: "bg-amber-50 border-amber-100",
        iconColor: "text-amber-500",
      })
    }

    if (data.samples?.approved > 0 && data.bulk_orders?.total === 0) {
      alerts.push({
        id: 5,
        type: "info",
        icon: "ti-info-circle",
        title: "Approved samples without orders",
        message: `${data.samples.approved} sample(s) approved but no bulk orders created yet`,
        color: "bg-blue-50 border-blue-100",
        iconColor: "text-blue-500",
      })
    }

    if (alerts.length === 0) {
      alerts.push({
        id: 6,
        type: "success",
        icon: "ti-check",
        title: "All clear!",
        message: "No alerts at the moment. Everything is on track.",
        color: "bg-green-50 border-green-100",
        iconColor: "text-green-500",
      })
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-medium">Alerts</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {alerts.length} active alerts
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-400">Loading alerts...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-xl p-4 flex items-start gap-4 ${alert.color}`}
              >
                <div className={`mt-0.5 ${alert.iconColor}`}>
                  <i className={`ti ${alert.icon} text-xl`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-medium mb-4">Quick summary</p>
          {data && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Total samples</p>
                <p className="text-xl font-medium mt-1">{data.samples?.total || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Approved</p>
                <p className="text-xl font-medium mt-1 text-green-700">{data.samples?.approved || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Bulk orders</p>
                <p className="text-xl font-medium mt-1">{data.bulk_orders?.total || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Delayed</p>
                <p className="text-xl font-medium mt-1 text-red-600">{data.bulk_orders?.delayed || 0}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
