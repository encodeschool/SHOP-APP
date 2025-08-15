import React, { useState, useEffect } from "react";
import axios from "../../api/axios"; // Your centralized axios instance

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [form, setForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: null
  });

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      const { data } = await axios.get("/banner");
      setBanners(data);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file change
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Create or update banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const bannerJson = {
        title: form.title,
        description: form.description,
        buttonText: form.buttonText,
        buttonLink: form.buttonLink
      };
      formData.append("banner", new Blob([JSON.stringify(bannerJson)], { type: "application/json" }));
      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await axios.put(`/banner/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post("/banner", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setForm({
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        image: null
      });
      setEditingId(null);
      fetchBanners();
    } catch (err) {
      console.error("Failed to save banner", err);
    }
  };

  // Edit banner
  const handleEdit = (banner) => {
    setForm({
      title: banner.title,
      description: banner.description,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      image: null
    });
    setEditingId(banner.id);
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`/banner/${id}`);
      fetchBanners();
    } catch (err) {
      console.error("Failed to delete banner", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{editingId ? "Edit Banner" : "Create Banner"}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="buttonText"
          placeholder="Button Text"
          value={form.buttonText}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="buttonLink"
          placeholder="Button Link"
          value={form.buttonLink}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded col-span-1 md:col-span-2"
          accept="image/*"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {editingId ? "Update Banner" : "Create Banner"}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Banners</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="border rounded shadow p-2">
            {banner.image && (
              <img
                src={`${BASE_URL}${banner.image}`}
                alt={banner.title}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h3 className="font-bold mt-2">{banner.title}</h3>
            <p className="text-sm text-gray-600">{banner.description}</p>
            <p className="text-sm">Button: {banner.buttonText}</p>
            <p className="text-sm">Link: {banner.buttonLink}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(banner)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
