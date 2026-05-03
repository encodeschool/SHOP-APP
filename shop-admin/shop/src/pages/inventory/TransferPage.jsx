import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  FaPlus,
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
export default function TransferPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showDrawer, setShowDrawer] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    productId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    quantity: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [w, p, t] = await Promise.all([
        axios.get("/warehouses"),
        axios.get("/products"),
        axios.get("/inventory/movements"),
      ]);

      setWarehouses(w.data || []);
      setProducts(p.data || []);
      setTransfers(t.data || []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.productId || !form.fromWarehouseId || !form.toWarehouseId || !form.quantity) {
      showToast("All fields required", "error");
      return;
    }

    try {
      await axios.post("/inventory/transfer", form);
      showToast("Transfer completed");
      setShowDrawer(false);
      setForm({
        productId: "",
        fromWarehouseId: "",
        toWarehouseId: "",
        quantity: "",
      });
      fetchData();
    } catch {
      showToast("Transfer failed", "error");
    }
  };

  /* ================= FILTER ================= */
  const filtered = transfers.filter(t =>
    t.productName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex gap-4 relative">

      <Toast msg={toast?.msg} type={toast?.type} />

      {/* ================= MAIN ================= */}
      <div className="w-full">

        <h2 className="text-xl font-bold">Transfers</h2>
        <p className="text-sm text-slate-500 mb-4">{transfers.length} total</p>

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDrawer(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm"
            >
              <FaPlus /> New Transfer
            </button>

            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transfers..."
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
            <div className="p-10 text-center text-slate-400">No transfers</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Product</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">From</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">To</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Qty</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">{t.productName}</td>
                    <td className="px-4 py-3">{t.fromWarehouse}</td>
                    <td className="px-4 py-3">{t.toWarehouse}</td>
                    <td className="px-4 py-3">{t.quantity}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{t.createdAt}</td>
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
        ${showDrawer ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowDrawer(false)}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transform transition
        w-full md:w-[520px] flex flex-col
        ${showDrawer ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* HEADER */}
        <div className="flex justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">New Transfer</h2>
          <button onClick={() => setShowDrawer(false)}>×</button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          <Field label="Product">
            <select className={inputCls}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
            >
              <option value="">Select</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </Field>

          <Field label="From Warehouse">
            <select className={inputCls}
              onChange={(e) => setForm({ ...form, fromWarehouseId: e.target.value })}
            >
              <option value="">Select</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </Field>

          <Field label="To Warehouse">
            <select className={inputCls}
              onChange={(e) => setForm({ ...form, toWarehouseId: e.target.value })}
            >
              <option value="">Select</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Quantity">
            <input
              type="number"
              className={inputCls}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </Field>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t">
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl"
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}