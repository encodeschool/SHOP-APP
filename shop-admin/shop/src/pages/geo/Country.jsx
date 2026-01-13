import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Country() {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState({ code: "", name: "" });
  const [editingId, setEditingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCountries = () => {
    axios.get("/geo/countries").then(res => setCountries(res.data));
  };

  useEffect(fetchCountries, []);

  const save = async () => {
    if (!newCountry.code || !newCountry.name) return alert("Fill all fields");

    if (editingId) {
      await axios.put(`/geo/countries/${editingId}`, newCountry);
    } else {
      await axios.post("/geo/countries", newCountry);
    }

    setNewCountry({ code: "", name: "" });
    setEditingId(null);
    setIsDrawerOpen(false);
    fetchCountries();
  };

  const edit = (c) => {
    setNewCountry({ code: c.code, name: c.name });
    setEditingId(c.id);
    setIsDrawerOpen(true);
  };

  const del = async (code) => {
    if (window.confirm("Delete country?")) {
      await axios.delete(`/geo/countries/${code}`);
      fetchCountries();
    }
  };

  return (
    <div className="h-full">
      <div className="flex gap-4 h-full">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Countries</h2>
          <button onClick={() => {
            setEditingId(null);
            setNewCountry({ code: "", name: "" });
            setIsDrawerOpen(true);
          }} 
                  className="bg-green-500 mb-6 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            +
          </button>

          <table className="w-full mt-4 bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Code</th>
                <th className="p-2">Name</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map(c => (
                <tr key={c.code}>
                  <td className="p-2">{c.code}</td>
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">
                    <button onClick={() => edit(c)} className="bg-yellow-500 text-white px-2 mr-2">Edit</button>
                    <button onClick={() => del(c.id)} className="bg-red-500 text-white px-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          <div
              className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
                isDrawerOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div
            className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            } w-full md:w-[500px] overflow-y-auto`}
          >
          <div className="p-4">
            <h3 className="font-semibold mb-2 text-lg">
              {editingId ? "Edit Country" : "Add Country"}
            </h3>

            <input placeholder="Code" className="border p-2 w-full mb-2"
                value={newCountry.code}
                disabled={!!editingId}
                onChange={e => setNewCountry({ ...newCountry, code: e.target.value })} />
            <input placeholder="Name" className="border p-2 w-full mb-2"
                value={newCountry.name}
                onChange={e => setNewCountry({ ...newCountry, name: e.target.value })} />
            <button onClick={save} className="bg-blue-500 text-white w-full py-2">
                Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
