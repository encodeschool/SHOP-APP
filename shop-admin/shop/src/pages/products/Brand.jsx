import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Brand() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", icon: null });

  const fetchBrands = () => {
    setLoading(true);
    axios
      .get("/products/brands")
      .then((res) => {
        setBrands(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Failed to load brands");
      });
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "icon") {
      setForm({ ...form, icon: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = (brand) => {
    setForm({ name: brand.name, icon: null });
    setEditingId(brand.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await axios.delete(`/products/brands/${id}`);
      fetchBrands();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete brand");
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.icon) formData.append("multipartFile", form.icon);

      if (editingId) {
        await axios.put(`/products/brands/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/products/brands", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({ name: "", icon: null });
      setEditingId(null);
      fetchBrands();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save brand");
    }
  };

  return (
    <div className="h-full flex gap-4">
      {/* Left - Brand List */}
      <div className="w-[75%]">
        <h2 className="text-xl font-bold mb-4">Brands</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full border bg-white shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Icon</th>
                <th className="p-2">Brand Name</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td className="p-2">
                    {brand.icon ? (
                      <img
                        src={`http://localhost:8080${brand.icon}`}
                        alt="brand"
                        className="w-14 h-14 object-contain rounded"
                      />
                    ) : (
                      "No Icon"
                    )}
                  </td>
                  <td className="p-2 font-semibold">{brand.name}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="text-yellow-600 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="text-red-600"
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

      {/* Right - Add/Edit Brand Form */}
      <div className="w-[25%] p-4 bg-white shadow h-fit">
        <h3 className="font-semibold mb-2">{editingId ? "Edit" : "Add"} Brand</h3>

        <input
          type="file"
          name="icon"
          onChange={handleChange}
          className="border p-1 mb-3 w-full"
        />

        <input
          name="name"
          placeholder="Brand Name"
          value={form.name}
          onChange={handleChange}
          className="border p-1 mb-3 w-full"
        />

        <button
          onClick={handleSave}
          className={`w-full px-3 py-1 text-white ${editingId ? "bg-yellow-500" : "bg-blue-500"}`}
        >
          {editingId ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}
