import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Layout from "../components/layout/Layout"
import API from "../services/api"

function Badge({ status }) {
  const styles = {
    approved: "bg-green-50 text-green-800",
    pending: "bg-amber-50 text-amber-800",
    rejected: "bg-red-50 text-red-800",
    submitted: "bg-blue-50 text-blue-800",
    revised: "bg-teal-50 text-teal-800",
    resubmitted: "bg-blue-50 text-blue-800",
  }
  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status?.replace("_", " ")}
    </span>
  )
}
function StatusDropdown({ sample, onUpdate, userRole }) {
  const allowedStatuses = {
    admin: ["pending", "submitted", "approved", "rejected", "revised", "resubmitted"],
    merchandiser: ["pending", "submitted", "revised", "resubmitted"],
    buyer: ["approved", "rejected"],
    factory: [],
  }

  const options = allowedStatuses[userRole] || []

  if (options.length === 0) {
    return <Badge status={sample.status} />
  }

  return (
    <select
      value={sample.status}
      onChange={(e) => onUpdate(sample.id, e.target.value)}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-400 bg-white"
    >
      {options.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}

function CreateSampleModal({ onClose, onCreated }) {
  const [styles, setStyles] = useState([])
  const [form, setForm] = useState({
    style_id: "",
    sample_type: "proto",
    date_sent: "",
    status: "pending",
    buyer_comments: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    API.get("/styles").then((res) => setStyles(res.data))
  }, [])

  const handleSubmit = async () => {
    if (!form.style_id || !form.date_sent) {
      setError("Please fill all required fields")
      return
    }
    setLoading(true)
    try {
      await API.post("/samples", { sample: form })
      onCreated()
      onClose()
    } catch (err) {
      setError("Failed to create sample")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-100 p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">New sample</h2>
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
            <label className="text-xs text-gray-500 block mb-1">Style *</label>
            <select
              value={form.style_id}
              onChange={(e) => setForm({ ...form, style_id: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            >
              <option value="">Select style</option>
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.style_number} — {s.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Sample type *</label>
            <select
              value={form.sample_type}
              onChange={(e) => setForm({ ...form, sample_type: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            >
              <option value="proto">Proto</option>
              <option value="salesman">Salesman</option>
              <option value="pre_production">Pre production</option>
              <option value="production">Production</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Date sent *</label>
            <input
              type="date"
              value={form.date_sent}
              onChange={(e) => setForm({ ...form, date_sent: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Buyer comments</label>
            <textarea
              value={form.buyer_comments}
              onChange={(e) => setForm({ ...form, buyer_comments: e.target.value })}
              placeholder="Any comments from buyer..."
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
            {loading ? "Creating..." : "Create sample"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Samples() {
  const { user } = useAuth()
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)

  const fetchSamples = () => {
    setLoading(true)
    API.get("/samples")
      .then((res) => setSamples(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSamples() }, [])

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/samples/${id}/update_status`, { status })
      fetchSamples()
    } catch (err) {
      console.error(err)
    }
  }

  const filters = ["all", "pending", "submitted", "approved", "rejected", "revised"]


  const filtered = filter === "all"
    ? samples
    : samples.filter((s) => s.status === filter)

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium">Samples</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {samples.length} total samples
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800"
          >
            <i className="ti ti-plus text-base" />
            New sample
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
              {f}
            </button>
          ))}
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 text-xs text-gray-500 font-medium">
            <span className="col-span-2">Style</span>
            <span>Type</span>
            <span>Date sent</span>
            <span>Status</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">Loading samples...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">No samples found</p>
            </div>
          ) : (
            filtered.map((sample) => (
              <div
                key={sample.id}
                className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-gray-50 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-900">
                    {sample.style_id}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    #{String(sample.id).slice(0, 8)}
                  </p>
                </div>
                <span className="text-sm text-gray-600 capitalize">
                  {sample.sample_type?.replace("_", " ")}
                </span>
                <span className="text-sm text-gray-600">
                  {sample.date_sent}
                </span>
                <div className="flex items-center gap-2">
                  <StatusDropdown
                    sample={sample}
                    onUpdate={updateStatus}
                    userRole={user?.role}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <CreateSampleModal
          onClose={() => setShowModal(false)}
          onCreated={fetchSamples}
        />
      )}
    </Layout>
  )
}
