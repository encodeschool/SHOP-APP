import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    translations: [],
    image: null
  });

  // Fetch banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/banner");
      setBanners(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch banners", err);
      setError("Failed to fetch banner");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle text field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle translation change
  const handleTranslationChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.translations];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, translations: updated };
    });
  };

  const addTranslation = () => {
    setForm((prev) => ({
      ...prev,
      translations: [...prev.translations, { language: "", title: "", description: "", buttonText: "" }]
    }));
  };

  const removeTranslation = (index) => {
    setForm((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index)
    }));
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
        translations: form.translations   // <-- added translations
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
        await axios.post("/banner", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setForm({
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        translations: [],
        image: null
      });
      setEditingId(null);
      setIsDrawerOpen(false);
      fetchBanners();
    } catch (err) {
      console.error("Failed to save banner", err);
    }
  };

  // Edit
  const handleEdit = (banner) => {
    setForm({
      title: banner.title,
      description: banner.description,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      translations: banner.translations || [],
      image: null
    });
    setEditingId(banner.id);
    setIsDrawerOpen(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await axios.delete(`/banner/${id}`);
      fetchBanners();
    } catch (err) {
      console.error("Failed to delete banner", err);
    }
  };

  return (
    <div className="h-[100%] p-4">
      <div className="flex gap-4 h-[100%]">
        {/* Left Column */}
        <div className="w-[100%]">
          <h2 className="text-xl font-bold mb-4">Banner</h2>
          <button
            className="bg-green-500 mb-6 hover:bg-green-700 text-white font-bold py-2 mr-6 px-4 rounded"
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                description: "",
                buttonText: "",
                buttonLink: "",
                translations: [],
                image: null
              });
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
                  <th className="p-2">Image</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id}>
                    <td className="p-2">
                      {banner.image && (
                        <img
                          src={`${BASE_URL}${banner.image}`}
                          alt={banner.title}
                          className="w-full h-40 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="p-2">{banner.title}</td>
                    <td className="p-2">{banner.description}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
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
            isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          } w-[100%] md:w-[500px] overflow-y-scroll`}
        >
          <div className="p-4">
            <div className="p-4 bg-white shadow h-fit">
              <h3 className="text-2xl font-bold mb-4">{editingId ? "Edit Banner" : "Create Banner"}</h3>
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

              {/* Translations Section */}
              <div className="col-span-1 md:col-span-2 bg-gray-100 p-3 rounded">
                <h3 className="font-semibold mb-2">Translations</h3>

                {form.translations.map((t, index) => (
                  <div key={index} className="border p-3 rounded mb-3">
                    <select
                      className="border p-2 w-full mb-2"
                      value={t.language}
                      onChange={(e) => handleTranslationChange(index, "language", e.target.value)}
                    >
                      <option value="">Select Language</option>
                      <option value="en">English</option>
                      <option value="ru">Russian</option>
                      <option value="uz">Uzbek</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Translated Title"
                      className="border p-2 w-full mb-2"
                      value={t.title}
                      onChange={(e) => handleTranslationChange(index, "title", e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Translated Description"
                      className="border p-2 w-full mb-2"
                      value={t.description}
                      onChange={(e) => handleTranslationChange(index, "description", e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Button Translation"
                      className="border p-2 w-full mb-2"
                      value={t.buttonText}
                      onChange={(e) => handleTranslationChange(index, "buttonText", e.target.value)}
                    />

                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => removeTranslation(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={addTranslation}
                >
                  Add Translation
                </button>
              </div>

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
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
