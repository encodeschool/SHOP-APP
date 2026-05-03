import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  FaSearch,
  FaPlus,
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

/* ================= FIELD ================= */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400";

/* ================= PAGE ================= */
export default function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= FETCH ================= */
  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/inventory/stock");
      setStocks(res.data || []);
      setFiltered(res.data || []);
    } catch {
      showToast("Failed to load stock", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const f = stocks.filter((s) =>
      s.productName?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, stocks]);

  /* ================= ADJUST ================= */
  const openAdjust = (item) => {
    setSelected(item);
    setAdjustQty("");
    setDrawerOpen(true);
  };

  const handleAdjust = async () => {
    if (!adjustQty) {
      showToast("Enter quantity", "error");
      return;
    }

    try {
      await axios.post("/inventory/increase", null, {
        params: {
          productId: selected.productId,
          warehouseId: selected.warehouseId,
          qty: adjustQty,
          reason: "Manual adjustment",
        },
      });

      showToast("Stock updated");
      setDrawerOpen(false);
      fetchStock();
    } catch {
      showToast("Adjustment failed", "error");
    }
  };

  return (
    <div className="h-full flex gap-4 relative">

      <Toast msg={toast?.msg} type={toast?.type} />

      {/* ================= MAIN ================= */}
      <div className="w-full">

        <h2 className="text-xl font-bold">Stock</h2>
        <p className="text-sm text-slate-500 mb-4">{stocks.length} records</p>

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

          <div className="flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stock..."
                className="border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-slate-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No stock found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Product</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Warehouse</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Stock</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">{s.productName}</td>
                    <td className="px-4 py-3">{s.warehouseName}</td>
                    <td className="px-4 py-3 font-bold text-indigo-600">
                      {s.quantity}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openAdjust(s)}
                        className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition
        ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transform transition
        w-full md:w-[480px] flex flex-col
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* HEADER */}
        <div className="flex justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold">Adjust Stock</h2>
            <p className="text-xs text-slate-400">
              {selected?.productName} ({selected?.warehouseName})
            </p>
          </div>

          <button onClick={() => setDrawerOpen(false)}>×</button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          <Field label="Quantity">
            <input
              type="number"
              value={adjustQty}
              onChange={(e) => setAdjustQty(e.target.value)}
              className={inputCls}
              placeholder="Enter quantity"
            />
          </Field>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t">
          <button
            onClick={handleAdjust}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl"
          >
            Confirm Adjustment
          </button>
        </div>

      </div>
    </div>
  );
}