import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaImage,
  FaCheck
} from "react-icons/fa";

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

export default function Brand() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ name: "", icon: null });
  const [preview, setPreview] = useState(null);

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL || "";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/products/brands");
      setBrands(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load brands", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", icon: null });
    setPreview(null);
    setIsDrawerOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({ name: b.name, icon: null });
    setPreview(b.icon ? `${BASE_URL}${b.icon}` : null);
    setIsDrawerOpen(true);
  };

  const handleChange = (e) => {
    if (e.target.name === "icon") {
      const file = e.target.files[0];
      setForm({ ...form, icon: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.icon) fd.append("multipartFile", form.icon);

      if (editingId) {
        await axios.put(`/products/brands/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Brand updated");
      } else {
        await axios.post("/products/brands", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Brand created");
      }

      setIsDrawerOpen(false);
      fetchBrands();
    } catch {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;

    try {
      await axios.delete(`/products/brands/${id}`);
      showToast("Deleted");
      fetchBrands();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex gap-4 relative">

      <Toast msg={toast?.msg} type={toast?.type} />

      {/* ───────────────────────────── LEFT SIDE ───────────────────────────── */}
      <div className="w-full">

        <h2 className="text-xl font-bold">Brands</h2>
        <p className="text-sm text-slate-500 mb-4">{brands.length} total</p>

        {/* HEADER (MATCH PRODUCT PAGE STYLE) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

          <div className="flex items-center gap-2">
            {/* ADD BUTTON (same style as products) */}
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm"
            >
              <span className="text-lg leading-none"><FaPlus /></span> New Brand
            </button>

            {/* SEARCH (same style as products) */}
            <div className="flex gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search brands..."
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
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
              No brands found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Icon</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">

                    <td className="px-4 py-3">
                      {b.icon ? (
                        <img
                          src={`${BASE_URL}${b.icon}`}
                          className="w-12 h-12 object-contain rounded-lg"
                          alt=""
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400">
                          <FaImage />
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 font-semibold">{b.name}</td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(b)}
                          className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
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

      {/* ───────────────────────────── BACKDROP (FIXED like Product page) ───────────────────────────── */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300
        ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* ───────────────────────────── DRAWER (MATCH PRODUCT STYLE) ───────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transform transition-transform duration-300
        w-full md:w-[520px] flex flex-col
        ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold">
              {editingId ? "Edit Brand" : "New Brand"}
            </h2>
            <p className="text-xs text-slate-400">Brand details</p>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          <Field label="Brand Name">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputCls}
              placeholder="Enter brand name"
            />
          </Field>

          <Field label="Icon">
            <input type="file" name="icon" onChange={handleChange} />
          </Field>

          {preview && (
            <img
              src={preview}
              className="w-24 h-24 object-contain border rounded-xl"
              alt=""
            />
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
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