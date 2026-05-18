import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import API from "../services/api"

function CreateStyleModal({ onClose, onCreated }) {
  const [buyers, setBuyers] = useState([])
  const [form, setForm] = useState({
    style_number: "",
    description: "",
    buyer_id: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    API.get("/buyers").then((res) => setBuyers(res.data))
  }, [])

  const handleSubmit = async () => {
    if (!form.style_number || !form.description || !form.buyer_id) {
      setError("Please fill all required fields")
      return
    }
    setLoading(true)
    try {
      await API.post("/styles", { style: form })
      onCreated()
      onClose()
    } catch (err) {
      setError("Failed to create style")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-100 p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">New style</h2>
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
              Style number *
            </label>
            <input
              type="text"
              value={form.style_number}
              onChange={(e) => setForm({ ...form, style_number: e.target.value })}
              placeholder="ST001"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Description *
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Men's polo shirt"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Buyer *
            </label>
            <select
              value={form.buyer_id}
              onChange={(e) => setForm({ ...form, buyer_id: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            >
              <option value="">Select buyer</option>
              {buyers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.country}
                </option>
              ))}
            </select>
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
            {loading ? "Creating..." : "Create style"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Styles() {
  const [styles, setStyles] = useState([])
  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")

  const fetchStyles = () => {
    setLoading(true)
    Promise.all([
      API.get("/styles"),
      API.get("/buyers"),
    ])
      .then(([stylesRes, buyersRes]) => {
        setStyles(stylesRes.data)
        setBuyers(buyersRes.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchStyles() }, [])

  const getBuyerName = (buyer_id) => {
    const buyer = buyers.find((b) => b.id === buyer_id)
    return buyer ? buyer.name : "Unknown"
  }

  const filtered = styles.filter((s) =>
    s.style_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium">Styles</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {styles.length} total styles
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800"
          >
            <i className="ti ti-plus text-base" />
            New style
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search styles..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 text-xs text-gray-500 font-medium">
            <span>Style number</span>
            <span className="col-span-2">Description</span>
            <span>Buyer</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">Loading styles...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">No styles found</p>
            </div>
          ) : (
            filtered.map((style) => (
              <div
                key={style.id}
                className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-gray-50 items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-emerald-700">
                  {style.style_number}
                </span>
                <span className="col-span-2 text-sm text-gray-600">
                  {style.description}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">
                    {getBuyerName(style.buyer_id)?.slice(0, 1)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {getBuyerName(style.buyer_id)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <CreateStyleModal
          onClose={() => setShowModal(false)}
          onCreated={fetchStyles}
        />
      )}
    </Layout>
  )
}
