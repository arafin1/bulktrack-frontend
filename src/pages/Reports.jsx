import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import API from "../services/api"

function StatCard({ label, value, color, icon }) {
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

export default function Reports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const approvalRate = data
    ? Math.round((data.samples?.approved / data.samples?.total) * 100) || 0
    : 0

  const completionRate = data
    ? Math.round((data.bulk_orders?.completed / data.bulk_orders?.total) * 100) || 0
    : 0

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-medium">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Production and sample analytics
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-400">Loading reports...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total samples"
                value={data?.samples?.total || 0}
                icon="ti-shirt"
              />
              <StatCard
                label="Approval rate"
                value={`${approvalRate}%`}
                color="text-green-700"
                icon="ti-check"
              />
              <StatCard
                label="Total orders"
                value={data?.bulk_orders?.total || 0}
                icon="ti-package"
              />
              <StatCard
                label="Completion rate"
                value={`${completionRate}%`}
                color="text-blue-700"
                icon="ti-chart-bar"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm font-medium mb-4">Sample breakdown</p>
                {[
                  { label: "Approved", value: data?.samples?.approved || 0, color: "bg-green-500", textColor: "text-green-700" },
                  { label: "Pending", value: data?.samples?.pending || 0, color: "bg-amber-400", textColor: "text-amber-700" },
                  { label: "Rejected", value: data?.samples?.rejected || 0, color: "bg-red-400", textColor: "text-red-700" },
                  { label: "Revised", value: data?.samples?.revised || 0, color: "bg-teal-400", textColor: "text-teal-700" },
                  { label: "Submitted", value: data?.samples?.submitted || 0, color: "bg-blue-400", textColor: "text-blue-700" },
                ].map((item) => (
                  <div key={item.label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{item.label}</span>
                      <span className={`font-medium ${item.textColor}`}>
                        {item.value}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{
                          width: `${Math.round(
                            (item.value / (data?.samples?.total || 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm font-medium mb-4">Order breakdown</p>
                {[
                  { label: "Not started", value: data?.bulk_orders?.not_started || 0, color: "bg-gray-300", textColor: "text-gray-600" },
                  { label: "In progress", value: data?.bulk_orders?.in_progress || 0, color: "bg-blue-400", textColor: "text-blue-700" },
                  { label: "Completed", value: data?.bulk_orders?.completed || 0, color: "bg-green-500", textColor: "text-green-700" },
                  { label: "Delayed", value: data?.bulk_orders?.delayed || 0, color: "bg-red-400", textColor: "text-red-700" },
                  { label: "Shipped", value: data?.bulk_orders?.shipped || 0, color: "bg-teal-400", textColor: "text-teal-700" },
                ].map((item) => (
                  <div key={item.label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{item.label}</span>
                      <span className={`font-medium ${item.textColor}`}>
                        {item.value}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{
                          width: `${Math.round(
                            (item.value / (data?.bulk_orders?.total || 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {data?.buyers_summary && (
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm font-medium mb-4">Buyers performance</p>
                <div className="grid grid-cols-5 gap-4 text-xs text-gray-500 font-medium pb-2 border-b border-gray-50">
                  <span className="col-span-2">Buyer</span>
                  <span>Styles</span>
                  <span>Samples</span>
                  <span>Orders</span>
                </div>
                {data.buyers_summary.map((buyer) => (
                  <div
                    key={buyer.buyer}
                    className="grid grid-cols-5 gap-4 py-3 border-b border-gray-50 last:border-0 items-center"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">
                        {buyer.buyer?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{buyer.buyer}</p>
                        <p className="text-xs text-gray-400">{buyer.country}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {buyer.total_styles}
                    </span>
                    <span className="text-sm text-gray-600">
                      {buyer.total_samples}
                    </span>
                    <div>
                      <span className="text-sm text-gray-600">
                        {buyer.total_bulk_orders}
                      </span>
                      {buyer.delayed_orders > 0 && (
                        <span className="text-xs text-red-500 ml-2">
                          {buyer.delayed_orders} delayed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
