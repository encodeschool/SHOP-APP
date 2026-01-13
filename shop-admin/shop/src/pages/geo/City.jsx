import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function City() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ name: "", countryCode: "" });
  const [editingId, setEditingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    axios.get("/geo/countries").then(res => setCountries(res.data));
  }, []);

  const fetchCities = (code) => {
    axios.get(`/geo/cities?countryCode=${code}`).then(res => setCities(res.data));
  };

  const save = async () => {
    if (!form.name || !form.countryCode) return alert("Fill all fields");

    if (editingId) {
      await axios.put(`/geo/cities/${editingId}`, form);
    } else {
      await axios.post("/geo/cities", form);
    }

    setForm({ name: "", countryCode: "" });
    setEditingId(null);
    setIsDrawerOpen(false);
    fetchCities(form.countryCode);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete city?")) {
      try {
        await axios.delete(`/geo/cities/${id}`);
        fetchCities();
      } catch (error) {
        console.error("Error deleting city: ", error);
        alert("Failed to delete unit. Check console for details.")
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cities</h2>

      <select className="border p-2 mb-3"
        onChange={e => fetchCities(e.target.value)}>
        <option>Select country</option>
        {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>

      <button onClick={() => setIsDrawerOpen(true)} className="bg-green-500 text-white px-4 py-2 ml-4">+</button>

      <table className="w-full bg-white border mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">City</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map(c => (
            <tr key={c.id}>
              <td className="p-2">{c.name}</td>
              <td className="p-2">
                <button onClick={() => {
                  setForm({ name: c.name, countryCode: c.countryCode });
                  setEditingId(c.id);
                  setIsDrawerOpen(true);
                }} className="bg-yellow-500 text-white px-2 mr-2">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-2 mr-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDrawerOpen && (
        <div className="fixed right-0 top-0 w-[400px] h-full bg-white shadow p-4">
          <h3>{editingId ? "Edit" : "Add"} City</h3>
          <select className="border p-2 w-full mb-2"
            value={form.countryCode}
            onChange={e => setForm({ ...form, countryCode: e.target.value })}>
            <option>Select country</option>
            {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <input placeholder="City name" className="border p-2 w-full mb-2"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <button onClick={save} className="bg-blue-500 text-white w-full py-2">Save</button>
        </div>
      )}
    </div>
  );
}
