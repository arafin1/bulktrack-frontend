import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import API from "../services/api"

function Badge({ status }) {
  const styles = {
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

function CreateOrderModal({ onClose, onCreated }) {
  const [samples, setSamples] = useState([])
  const [form, setForm] = useState({
    sample_id: "",
    quantity: "",
    quantity_unit: "pcs",
    delivery_date: "",
    production_status: "not_started",
    factory_notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    API.get("/samples")
      .then((res) => setSamples(res.data.filter((s) => s.status === "approved")))
  }, [])

  const handleSubmit = async () => {
    if (!form.sample_id || !form.quantity || !form.delivery_date) {
      setError("Please fill all required fields")
      return
    }
    setLoading(true)
    try {
      await API.post("/bulk_orders", { bulk_order: form })
      onCreated()
      onClose()
    } catch (err) {
      setError("Failed to create order. Make sure sample is approved.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-100 p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">New bulk order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="ti ti-x text-lg" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Approved sample *
            </label>
            <select
              value={form.sample_id}
              onChange={(e) => setForm({ ...form, sample_id: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            >
              <option value="">Select approved sample</option>
              {samples.map((s) => (
                <option key={s.id} value={s.id}>
                  {String(s.id)} — {s.sample_type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Quantity *</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="5000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Unit *</label>
              <select
                value={form.quantity_unit}
                onChange={(e) => setForm({ ...form, quantity_unit: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              >
                <option value="pcs">pcs</option>
                <option value="yds">yds</option>
                <option value="meters">meters</option>
                <option value="kg">kg</option>
                <option value="dozens">dozens</option>
                <option value="sets">sets</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Delivery date *</label>
            <input
              type="date"
              value={form.delivery_date}
              onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Factory notes</label>
            <textarea
              value={form.factory_notes}
              onChange={(e) => setForm({ ...form, factory_notes: e.target.value })}
              placeholder="Any production notes..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-emerald-700 text-white rounded-lg py-2 text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create order"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BulkOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)

  const fetchOrders = () => {
    setLoading(true)
    API.get("/bulk_orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/bulk_orders/${id}/update_status`, {
        production_status: status,
      })
      fetchOrders()
    } catch (err) {
      console.error(err)
    }
  }

  const filters = ["all", "not_started", "in_progress", "completed", "delayed", "shipped"]

  const filtered = filter === "all"
    ? orders
    : orders.filter((o) => o.production_status === filter)

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium">Bulk orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {orders.length} total orders
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800"
          >
            <i className="ti ti-plus text-base" />
            New order
          </button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                filter === f
                  ? "bg-emerald-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 text-xs text-gray-500 font-medium">
            <span className="col-span-2">Order</span>
            <span>Quantity</span>
            <span>Delivery</span>
            <span>Status</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">Loading orders...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">No orders found</p>
            </div>
          ) : (
            filtered.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-gray-50 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-900">
                    #{String(order.id).slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.factory_notes || "No notes"}
                  </p>
                </div>
                <span className="text-sm text-gray-600">
                  {order.quantity} {order.quantity_unit}
                </span>
                <span className="text-sm text-gray-600">
                  {order.delivery_date}
                </span>
                <div className="flex items-center gap-2">
                  <Badge status={order.production_status} />
                  <select
                    value={order.production_status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-400 bg-white"
                  >
                    <option value="not_started">not started</option>
                    <option value="in_progress">in progress</option>
                    <option value="completed">completed</option>
                    <option value="delayed">delayed</option>
                    <option value="shipped">shipped</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <CreateOrderModal
          onClose={() => setShowModal(false)}
          onCreated={fetchOrders}
        />
      )}
    </Layout>
  )
}
