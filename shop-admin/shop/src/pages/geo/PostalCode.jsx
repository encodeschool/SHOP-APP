import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function PostalCode() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [postals, setPostals] = useState([]);

  const [form, setForm] = useState({
    code: "",
    city: "",
    countryCode: "",
    active: true,
  });

  const [editingId, setEditingId] = useState(null);

  // ===== LOAD COUNTRIES =====
  useEffect(() => {
    axios.get("/geo/countries").then(res => setCountries(res.data));
  }, []);

  // ===== LOAD CITIES =====
  const loadCities = (countryCode) => {
    if (!countryCode) return;
    axios
      .get(`/geo/cities?countryCode=${countryCode}`)
      .then(res => setCities(res.data));
  };

  // ===== LOAD POSTAL CODES =====
  const loadPostals = (countryCode, city) => {
    if (!countryCode || !city) return;
    axios
      .get(`/geo/postal-codes?countryCode=${countryCode}&city=${city}`)
      .then(res => setPostals(res.data));
  };

  // ===== CREATE OR UPDATE =====
  const saveOrUpdate = async () => {
    if (!form.code || !form.city || !form.countryCode) {
      alert("All fields are required");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/geo/postal-codes/${editingId}`, form);
      } else {
        await axios.post("/geo/postal-codes", form);
      }

      resetForm();
      loadPostals(form.countryCode, form.city);
    } catch (err) {
      console.error("Failed to save postal code", err);
      alert("Error saving postal code");
    }
  };

  // ===== EDIT =====
  const handleEdit = (postal) => {
    setForm({
      code: postal.code,
      city: postal.city,
      countryCode: postal.countryCode,
      active: postal.active,
    });

    setEditingId(postal.id);
    loadCities(postal.countryCode);
    loadPostals(postal.countryCode, postal.city);
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this postal code?")) return;

    try {
      await axios.delete(`/geo/postal-codes/${id}`);
      loadPostals(form.countryCode, form.city);
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Delete failed");
    }
  };

  // ===== RESET =====
  const resetForm = () => {
    setForm({
      code: "",
      city: "",
      countryCode: "",
      active: true,
    });
    setEditingId(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Postal Codes</h2>

      {/* ===== FORM ===== */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* COUNTRY */}
        <select
          className="border p-2 rounded"
          value={form.countryCode}
          onChange={(e) => {
            const code = e.target.value;
            setForm({ ...form, countryCode: code, city: "" });
            setCities([]);
            setPostals([]);
            loadCities(code);
          }}
        >
          <option value="">Select country</option>
          {countries.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>

        {/* CITY */}
        <select
          className="border p-2 rounded"
          value={form.city}
          onChange={(e) => {
            const city = e.target.value;
            setForm({ ...form, city });
            loadPostals(form.countryCode, city);
          }}
          disabled={!form.countryCode}
        >
          <option value="">Select city</option>
          {cities.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* POSTAL CODE */}
        <input
          className="border p-2 rounded"
          placeholder="Postal Code"
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })}
        />

        {/* BUTTON */}
        <button
          onClick={saveOrUpdate}
          className={`px-4 py-2 rounded text-white ${
            editingId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* ===== LIST ===== */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Postal Code</th>
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-left">Country</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {postals.map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{p.code}</td>
              <td className="p-2">{p.city}</td>
              <td className="p-2">{p.countryCode}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {postals.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No postal codes found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
