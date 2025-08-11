import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(null);

  const [form, setForm] = useState({
    name: "",
    parentId: "",
    icon: null
  });

  const fetchCategories = () => {
    setLoading(true);
    axios
      .get("/categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch categories");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "icon") {
      setForm({ ...form, icon: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.parentId) formData.append("parentId", form.parentId);
      if (form.icon) formData.append("icon", form.icon);

      if (editingId) {
        await axios.put(`/categories/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post("/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setForm({ name: "", parentId: "", icon: null });
      setEditingId(null);
      setIsDrawerOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save category");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, parentId: cat.parentId || "" });
    setEditingId(cat.id);
    setIsDrawerOpen(true);
  };

  const parentCategories = categories.filter((cat) => cat.parentId === null);

  return (
    <div className="h-[100%]">
      <div className="flex gap-4 h-[100%]">
        {/* Left Column - User Table (70%) */}
        <div className="w-[100%]">
          <h2 className="text-xl font-bold mb-4">Category</h2>
          <button
                className='bg-green-500 mb-6 hover:bg-green-700 text-white font-bold py-2 mr-6 px-4 rounded'
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", parentId: "", icon: null });
                  setIsDrawerOpen(true);
                }}
          >
                +
          </button>
          {loading ? (
            <div className="p-4">Loading categories...</div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            <table className="w-full border bg-white shadow">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Icon</th>
                  <th className="p-2">Main Category</th>
                  <th className="p-2">Subcategories</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parentCategories.map((parent) => (
                  <tr key={parent.id}>
                    <td className="p-2">
                    {parent.icon ? (
                      <img
                        src={`http://localhost:8080${parent.icon}`}
                        alt="Profile"
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 50 }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                    <td className="p-2 font-bold">{parent.name}</td>
                    <td className="p-2">
                      {categories
                        .filter((sub) => sub.parentId === parent.id)
                        .map((sub) => (
                          <span
                            key={sub.id}
                            className="inline-block bg-gray-100 px-2 py-1 m-1 rounded"
                          >
                            {sub.name}
                            <button
                              onClick={() => handleEdit(sub)}
                              className="text-yellow-600 ml-2 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="text-red-500 ml-1 text-sm"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEdit(parent)}
                        className="bg-yellow-500 text-white px-2 py-1 text-sm mr-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(parent.id)}
                        className="bg-red-500 text-white px-2 py-1 text-sm"
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
      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } w-[100%] md:w-[500px] overflow-y-scroll`}
      >
        <div className="p-4">
          <div className="w-[100%] p-4 bg-white shadow h-[auto]">
            <h3 className="font-semibold mb-2">{editingId ? "Edit" : "Add"} Category</h3>

            <input
              type="file"
              name="icon"
              onChange={handleChange}
              className="border p-1 mb-3 w-[100%]"
            />


            <input
              name="name"
              placeholder="Category Name"
              value={form.name}
              onChange={handleChange}
              className="border p-1 mb-3 w-[100%]"
            />

            <select
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
              className="border p-1 mb-3 w-[100%]"
            >
              <option value="">-- Main Category --</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSave}
              className={editingId ? "bg-yellow-500 text-white px-3 py-1 w-[100%]" : "bg-blue-500 text-white px-3 py-1 w-[100%]"}
            >
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>

        {/* Right Column - Add/Edit Form (30%) */}
        
      </div>
    </div>
  );
}
