import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [form, setForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: null,
    translations: [
      { lang: "uz", title: "", description: "", buttonText: "" },
      { lang: "ru", title: "", description: "", buttonText: "" },
      { lang: "en", title: "", description: "", buttonText: "" }
    ]
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

  // Handle simple input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle translation inputs
  const handleTranslationChange = (index, field, value) => {
    const updated = [...form.translations];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, translations: updated }));
  };

  // Handle image
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      const bannerJson = {
        title: form.title,
        description: form.description,
        buttonText: form.buttonText,
        buttonLink: form.buttonLink,
        translations: form.translations
      };

      formData.append(
        "banner",
        new Blob([JSON.stringify(bannerJson)], { type: "application/json" })
      );

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await axios.put(`/banner/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post(`/banner`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      // Reset form
      setForm({
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        image: null,
        translations: [
          { lang: "uz", title: "", description: "", buttonText: "" },
          { lang: "ru", title: "", description: "", buttonText: "" },
          { lang: "en", title: "", description: "", buttonText: "" }
        ]
      });

      setEditingId(null);
      fetchBanners();
    } catch (err) {
      console.error("Failed to save banner", err);
    }
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.title,
      description: banner.description,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      image: null,
      translations: banner.translations || []
    });
    setEditingId(banner.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete banner?")) return;
    try {
      await axios.delete(`/banner/${id}`);
      fetchBanners();
    } catch (err) {
      console.error("Failed to delete banner", err);
    }
  };

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Banner" : "Create Banner"}
      </h1>

      {/* ==== FORM ==== */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">

        {/* Main fields */}
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 rounded" required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" required />
        <input name="buttonText" placeholder="Button Text" value={form.buttonText} onChange={handleChange} className="border p-2 rounded" required />
        <input name="buttonLink" placeholder="Button Link" value={form.buttonLink} onChange={handleChange} className="border p-2 rounded" required />

        {/* Image */}
        <input type="file" onChange={handleFileChange} accept="image/*" className="border p-2 rounded col-span-2" />

        {/* TRANSLATIONS */}
        <div className="col-span-2 bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-3">Translations</h2>

          {form.translations.map((t, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 border rounded bg-white">
              <div>
                <label className="text-sm font-semibold">{t.lang.toUpperCase()} Title</label>
                <input
                  value={t.title}
                  onChange={(e) => handleTranslationChange(idx, "title", e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">{t.lang.toUpperCase()} Description</label>
                <input
                  value={t.description}
                  onChange={(e) => handleTranslationChange(idx, "description", e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">{t.lang.toUpperCase()} Button Text</label>
                <input
                  value={t.buttonText}
                  onChange={(e) => handleTranslationChange(idx, "buttonText", e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
          {editingId ? "Update Banner" : "Create Banner"}
        </button>
      </form>

      {/* ==== LIST ==== */}
      <h2 className="text-xl font-bold mb-4">Banners</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="border rounded p-2 shadow">
            {b.image && <img src={`${BASE_URL}${b.image}`} className="w-full h-40 object-cover rounded" alt="" />}
            <h3 className="font-bold">{b.title}</h3>
            <p>{b.description}</p>

            <div className="mt-2 flex gap-2">
              <button onClick={() => handleEdit(b)} className="bg-yellow-500 px-3 py-1 rounded text-white">Edit</button>
              <button onClick={() => handleDelete(b.id)} className="bg-red-500 px-3 py-1 rounded text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
