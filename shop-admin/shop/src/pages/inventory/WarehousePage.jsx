import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaCheck
} from "react-icons/fa";

/* ───────────────── Toast ───────────────── */
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

/* ───────────────── Field ───────────────── */
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

/* ───────────────── MAIN ───────────────── */
export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ───────────────── FETCH ───────────────── */
  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/warehouses");
      setWarehouses(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load warehouses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  /* ───────────────── ACTIONS ───────────────── */
  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", address: "" });
    setShowDrawer(true);
  };

  const openEdit = (w) => {
    setEditingId(w.id);
    setForm({
      name: w.name,
      address: w.address,
    });
    setShowDrawer(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/warehouses/${editingId}`, form);
        showToast("Warehouse updated");
      } else {
        await axios.post("/warehouses", form);
        showToast("Warehouse created");
      }

      setShowDrawer(false);
      fetchWarehouses();
    } catch {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this warehouse?")) return;

    try {
      await axios.delete(`/warehouses/${id}`);
      showToast("Deleted");
      fetchWarehouses();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  /* ───────────────── FILTER ───────────────── */
  const filtered = warehouses.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ───────────────── UI ───────────────── */
  return (
    <div className="h-full flex gap-4 relative">

      <Toast msg={toast?.msg} type={toast?.type} />

      {/* LEFT */}
      <div className="w-full">

        <h2 className="text-xl font-bold">Warehouses</h2>
        <p className="text-sm text-slate-500 mb-4">
          {warehouses.length} total
        </p>

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

          <div className="flex items-center gap-2">

            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm"
            >
              <FaPlus /> New Warehouse
            </button>

            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search warehouses..."
                className="border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No warehouses found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-xs text-slate-500">Name</th>
                  <th className="px-4 py-3 text-xs text-slate-500">Address</th>
                  <th className="px-4 py-3 text-xs text-slate-500">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">{w.name}</td>
                    <td className="px-4 py-3">{w.address}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openEdit(w)}
                        className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg"
                      >
                        Delete
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
        ${showDrawer ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowDrawer(false)}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transition-transform
        w-full md:w-[450px]
        ${showDrawer ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 space-y-4">

          <h2 className="text-lg font-bold">
            {editingId ? "Edit Warehouse" : "New Warehouse"}
          </h2>

          <Field label="Name">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>

          <Field label="Address">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl"
          >
            {editingId ? "Update" : "Create"}
          </button>

        </div>
      </div>
    </div>
  );
}