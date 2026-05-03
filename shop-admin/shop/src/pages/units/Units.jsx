import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { FaPlus, FaSearch, FaTimes, FaCheck } from "react-icons/fa";

/* ───────────────────────── Toast ───────────────────────── */
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

/* ───────────────────────── Field ───────────────────────── */
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

/* ───────────────────────── Page ───────────────────────── */
export default function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newUnit, setNewUnit] = useState({ name: "", code: "" });
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/units");
      setUnits(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load units", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  /* ───────────────────────── Actions ───────────────────────── */

  const openCreate = () => {
    setEditingId(null);
    setNewUnit({ name: "", code: "" });
    setIsDrawerOpen(true);
  };

  const openEdit = (u) => {
    setEditingId(u.id);
    setNewUnit({ name: u.name, code: u.code });
    setIsDrawerOpen(true);
  };

  const handleChange = (e) => {
    setNewUnit({ ...newUnit, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!newUnit.name.trim() || !newUnit.code.trim()) {
      showToast("Fill all fields", "error");
      return;
    }

    try {
      const payload = {
        name: newUnit.name.trim(),
        code: newUnit.code.trim(),
      };

      if (editingId) {
        await axios.put(`/units/${editingId}`, payload);
        showToast("Unit updated");
      } else {
        await axios.post("/units", payload);
        showToast("Unit created");
      }

      setIsDrawerOpen(false);
      fetchUnits();
    } catch {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this unit?")) return;

    try {
      await axios.delete(`/units/${id}`);
      showToast("Deleted");
      fetchUnits();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const filtered = units.filter((u) =>
    (u.name + u.code).toLowerCase().includes(search.toLowerCase())
  );

  /* ───────────────────────── UI ───────────────────────── */

  return (
    <div className="h-full flex gap-4 relative">

      <Toast msg={toast?.msg} type={toast?.type} />

      {/* LEFT */}
      <div className="w-full">
        <h2 className="text-xl font-bold">Units</h2>
        <p className="text-sm text-slate-500 mb-4">{units.length} total</p>

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm"
          >
            <FaPlus /> New Unit
          </button>

          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search units..."
              className="border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-slate-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No units found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">

                    <td className="px-4 py-3 font-semibold">{u.name}</td>
                    <td className="px-4 py-3">{u.code}</td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(u.id)}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
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
        ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 w-full md:w-[520px]
        shadow-2xl transform transition-transform duration-300
        ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold">
            {editingId ? "Edit Unit" : "New Unit"}
          </h2>
        </div>

        <div className="p-6 space-y-4">

          <Field label="Unit Name">
            <input
              name="name"
              value={newUnit.name}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>

          <Field label="Code">
            <input
              name="code"
              value={newUnit.code}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>

        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={handleSave}
            className={`px-5 py-2 rounded-xl text-white text-sm font-semibold
            ${editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>

      </div>

    </div>
  );
}