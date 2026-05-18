import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import API from "../services/api"

function CreateBuyerModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.country) {
      setError("Please fill all required fields")
      return
    }
    setLoading(true)
    try {
      await API.post("/buyers", { buyer: form })
      onCreated()
      onClose()
    } catch (err) {
      setError("Failed to create buyer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-100 p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">New buyer</h2>
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
              Buyer name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="H&M"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="buyer@hm.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Country *
            </label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="Sweden"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
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
            {loading ? "Creating..." : "Create buyer"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Buyers() {
  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")

  const fetchBuyers = () => {
    setLoading(true)
    API.get("/buyers")
      .then((res) => setBuyers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBuyers() }, [])

  const filtered = buyers.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.country?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium">Buyers</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {buyers.length} total buyers
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800"
          >
            <i className="ti ti-plus text-base" />
            New buyer
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buyers..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 text-xs text-gray-500 font-medium">
            <span className="col-span-2">Buyer</span>
            <span>Country</span>
            <span>Email</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">Loading buyers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">No buyers found</p>
            </div>
          ) : (
            filtered.map((buyer) => (
              <div
                key={buyer.id}
                className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-gray-50 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">
                    {buyer.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {buyer.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <i className="ti ti-map-pin text-gray-400 text-xs" />
                  <span className="text-sm text-gray-600">{buyer.country}</span>
                </div>
                <span className="text-sm text-gray-500 truncate">
                  {buyer.email}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <CreateBuyerModal
          onClose={() => setShowModal(false)}
          onCreated={fetchBuyers}
        />
      )}
    </Layout>
  )
}
