import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  FaSearch,
  FaTimes,
  FaCheck
} from "react-icons/fa";

/* ================= TOAST ================= */
function Toast({ msg, type }) {
  if (!msg) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white
      ${type === "error" ? "bg-red-600" : "bg-emerald-600"}`}
    >
      {type === "error" ? <FaTimes /> : <FaCheck />}
      {msg}
    </div>
  );
}

/* ================= PAGE ================= */
export default function MovementsPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/inventory/movements");
      setData(res.data || []);
      setFiltered(res.data || []);
    } catch {
      showToast("Failed to load movements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const f = data.filter((m) =>
      m.product?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, data]);

  /* ================= TYPE STYLE ================= */
  const getTypeStyle = (type) => {
    switch (type) {
      case "IN":
        return "bg-emerald-100 text-emerald-700";
      case "OUT":
        return "bg-red-100 text-red-600";
      case "TRANSFER_IN":
        return "bg-blue-100 text-blue-600";
      case "TRANSFER_OUT":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="h-full flex gap-4 relative">

      <Toast msg={toast?.msg} type={toast?.type} />

      {/* ================= MAIN ================= */}
      <div className="w-full">

        <h2 className="text-xl font-bold">Inventory Movements</h2>
        <p className="text-sm text-slate-500 mb-4">{data.length} records</p>

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movements..."
              className="border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-slate-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No movements found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Product</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Qty</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Warehouse</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">

                    <td className="px-4 py-3 font-semibold">{m.product}</td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-lg font-semibold ${getTypeStyle(m.type)}`}>
                        {m.type}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-bold">
                      {m.type.includes("OUT") ? (
                        <span className="text-red-600">- {m.quantity}</span>
                      ) : (
                        <span className="text-emerald-600">+ {m.quantity}</span>
                      )}
                    </td>

                    <td className="px-4 py-3">{m.warehouse}</td>

                    <td className="px-4 py-3 text-xs text-slate-500">
                      {m.createdAt}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}