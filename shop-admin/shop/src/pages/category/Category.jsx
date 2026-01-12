import { useEffect, useState, useCallback } from "react";
import axios from "../../api/axios";


  function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  }

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL || "";
  const [form, setForm] = useState({
    name: "",
    parentId: "",
    categoryCode: "",
    subParentId: "",
    icon: null,
    translations: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery.trim(), 450);

  const fetchSearchResults = useCallback(async (q) => {
    if (!q) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await axios.get(`/categories/search/category`, {
        params: { q },
      });

      // Assuming the response is List<CategoryResponseDTO> like your table expects
      const flatSearch = flattenCategories(res.data || []);
      setSearchResults(flatSearch);
    } catch (err) {
      console.error("Search failed:", err);
      // optional: set some error state
    } finally {
      setSearchLoading(false);
    }
  }, []);   // dependencies — add if needed
  
  useEffect(() => {
    fetchSearchResults(debouncedQuery);
  }, [debouncedQuery, fetchSearchResults]);

  // Enhanced duplicate prevention and logging
  const flattenCategories = (cats, parentId = null, level = 0, path = []) => {
    const seenIds = new Set();
    const seenNameParentPairs = new Set();
    let flat = [];
    cats.forEach((cat, index) => {
      const nameParentKey = `${cat.name}:${cat.parentId || parentId || "null"}`;
      const currentPath = [...path, cat.id];
      if (!seenIds.has(cat.id) && !seenNameParentPairs.has(nameParentKey)) {
        seenIds.add(cat.id);
        seenNameParentPairs.add(nameParentKey);
        flat.push({
          id: cat.id,
          name: cat.name,
          categoryCode: cat.categoryCode,
          parentId: cat.parentId || parentId,
          icon: cat.icon,
          translations: cat.translations || [],
          level,
          path: currentPath,
        });
        if (cat.subcategories && cat.subcategories.length > 0) {
          if (currentPath.includes(cat.id)) {
            console.error(`Circular reference detected at level ${level}: ID=${cat.id}, Path=${currentPath.join(" -> ")}`);
            return;
          }
          flat = flat.concat(flattenCategories(cat.subcategories, cat.id, level + 1, currentPath));
        }
      } else {
        console.warn(`Duplicate category detected at level ${level}: ID=${cat.id}, Name=${cat.name}, ParentID=${cat.parentId || parentId}, Index=${index}, Path=${currentPath.join(" -> ")}`);
      }
    });
    return flat;
  };

  const fetchCategories = () => {
    setLoading(true);
    axios
      .get("/categories?lang=en")
      .then((res) => {
        // console.log("API Response:", JSON.stringify(res.data, null, 2));
        const flatCategories = flattenCategories(res.data);
        // console.log("Flattened Categories:", JSON.stringify(flatCategories, null, 2));
        // Check for duplicate IDs
        const idCount = new Map();
        flatCategories.forEach(cat => {
          idCount.set(cat.id, (idCount.get(cat.id) || 0) + 1);
          if (idCount.get(cat.id) > 1) {
            console.error(`Duplicate ID in flattened categories: ${cat.id}, Path=${cat.path.join(" -> ")}`);
          }
        });
        if (idCount.size < flatCategories.length) {
          setError("Duplicate categories detected; some categories may not be displayed correctly");
        }
        setCategories(flatCategories);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // console.log("Categories State:", JSON.stringify(categories, null, 2));
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "icon") {
      setForm({ ...form, icon: e.target.files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleTranslationChange = (index, field, value) => {
    setForm((prev) => {
      const updatedTranslations = [...prev.translations];
      updatedTranslations[index] = {
        ...updatedTranslations[index],
        [field]: value,
      };
      return { ...prev, translations: updatedTranslations };
    });
  };

  const addTranslation = () => {
    setForm((prev) => ({
      ...prev,
      translations: [...prev.translations, { language: "en", name: "" }],
    }));
  };

  const removeTranslation = (index) => {
    setForm((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!form.name && form.translations.every((t) => !t.name.trim())) {
      alert("At least one category name is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name || form.translations.find(t => t.language === "en")?.name || "");
      formData.append("categoryCode", form.categoryCode);
      const finalParentId = form.subParentId || form.parentId;
      if (finalParentId) formData.append("parentId", finalParentId);
      if (form.icon) formData.append("icon", form.icon);
      formData.append("translations", JSON.stringify(form.translations.filter(t => t.name.trim() !== "")));

      if (editingId) {
        await axios.put(`/categories/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        name: "",
        parentId: "",
        categoryCode: "",
        subParentId: "",
        icon: null,
        translations: [],
      });
      setEditingId(null);
      setIsDrawerOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Save failed:", err);
      alert(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete category");
    }
  };

  const handleEdit = (cat) => {
    const parent = categories.find((c) => c.id === cat.parentId);
    const translations = cat.translations
      ? cat.translations.map(t => ({ language: t.language, name: t.name }))
      : [];
    if (parent && parent.parentId) {
      setForm({
        name: cat.name || "",
        parentId: parent.parentId,
        categoryCode: cat.categoryCode,
        subParentId: parent.id,
        icon: null,
        translations,
      });
    } else {
      setForm({
        name: cat.name || "",
        parentId: cat.parentId || "",
        categoryCode: cat.categoryCode || "",
        subParentId: "",
        icon: null,
        translations,
      });
    }
    setEditingId(cat.id);
    setIsDrawerOpen(true);
  };

  const parentCategories = categories.filter((cat) => cat.parentId === null);
  const subCategories = (parentId) => {
    const subs = categories.filter((cat) => cat.parentId === parentId);
    // console.log(`subCategories for parentId ${parentId}:`, JSON.stringify(subs, null, 2));
    return subs;
  };

  return (
    <div className="h-[100%]">
      <div className="flex gap-4 h-[100%]">
        {/* Left Column */}
        <div className="w-[100%]">
          <h2 className="text-xl font-bold mb-4">Category</h2>
          <button
            className="bg-green-500 mb-6 hover:bg-green-700 text-white font-bold py-2 mr-6 px-4 rounded"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                parentId: "",
                categoryCode: "",
                subParentId: "",
                icon: null,
                translations: [],
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
                  <th className="p-2">Icon</th>
                  <th className="p-2">Main Category</th>
                  <th className="p-2">English Name</th>
                  <th className="p-2">Category Code</th>
                  <th className="p-2">Subcategories</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parentCategories.map((parent, index) => (
                  <tr key={`${parent.id}-${index}`}>
                    <td className="p-2">
                      {parent.icon ? (
                        <img
                          src={`${BASE_URL}${parent.icon}`}
                          alt="Profile"
                          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 50 }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="p-2 font-bold">{parent.name}</td>
                    <td className="p-2">
                      {parent.translations?.find((t) => t.language === "en")?.name || "N/A"}
                    </td>
                    <td className="p-2">
                      {parent.categoryCode}
                    </td>
                    <td className="p-2">
                      {[...new Map(subCategories(parent.id).map((sub) => [sub.id, sub])).values()].map((sub, subIndex) => (
                        <div key={`${sub.id}-${subIndex}`} className="ml-2">
                          <span className="inline-block bg-gray-100 px-2 py-1 m-1 rounded">
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
                          {[...new Map(subCategories(sub.id).map((subsub) => [subsub.id, subsub])).values()].map((subsub, subsubIndex) => (
                            <span
                              key={`${subsub.id}-${subsubIndex}`}
                              className="inline-block bg-gray-200 px-2 py-1 m-1 rounded ml-4"
                            >
                              {subsub.name}
                              <button
                                onClick={() => handleEdit(subsub)}
                                className="text-yellow-600 ml-2 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(subsub.id)}
                                className="text-red-500 ml-1 text-sm"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
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
              <h3 className="font-semibold mb-2">{editingId ? "Edit" : "Add"} Category</h3>

              {editingId && categories.find(c => c.id === editingId)?.icon && (
                <img
                  src={`${BASE_URL}${categories.find(c => c.id === editingId).icon}`}
                  alt="Current Icon"
                  className="w-16 h-16 mb-2"
                />
              )}
              <input
                type="file"
                name="icon"
                onChange={handleInputChange}
                className="border p-1 mb-3 w-full"
              />

              <input
                name="name"
                placeholder="Category Name (English)"
                value={form.name}
                onChange={handleInputChange}
                className="border p-1 mb-3 w-full"
              />

              <input
                name="categoryCode"
                placeholder="Category Code"
                value={form.categoryCode}
                onChange={handleInputChange}
                className="border p-1 mb-3 w-full"
              />

              <div className="mb-3">
                <h4 className="font-semibold mb-2">Translations</h4>
                {form.translations.map((translation, index) => (
                  <div key={`translation-${index}`} className="border p-2 mb-2 rounded">
                    <select
                      className="border p-1 mb-2 w-full"
                      value={translation.language}
                      onChange={(e) => handleTranslationChange(index, "language", e.target.value)}
                    >
                      <option value="">Select Language</option>
                      <option value="en">English</option>
                      <option value="ru">Russian</option>
                      <option value="uz">Uzbek</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Translated Name"
                      className="border p-1 mb-2 w-full"
                      value={translation.name}
                      onChange={(e) => handleTranslationChange(index, "name", e.target.value)}
                    />
                    <button
                      className="bg-red-500 text-white px-2 py-1 text-sm"
                      onClick={() => removeTranslation(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="bg-blue-500 text-white px-3 py-1"
                  onClick={addTranslation}
                >
                  Add Translation
                </button>
              </div>

              <select
                name="parentId"
                value={form.parentId}
                onChange={(e) => {
                  setForm({ ...form, parentId: e.target.value, subParentId: "" });
                }}
                className="border p-1 mb-3 w-full"
              >
                <option value="">-- Main Category --</option>
                {parentCategories.map((cat, index) => (
                  <option key={`${cat.id}-${index}`} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {form.parentId && (
                <select
                  name="subParentId"
                  value={form.subParentId}
                  onChange={handleInputChange}
                  className="border p-1 mb-3 w-full"
                >
                  <option value="">-- Optional Subcategory --</option>
                  {subCategories(form.parentId).map((sub, index) => (
                    <option key={`${sub.id}-${index}`} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={handleSave}
                className={editingId ? "bg-yellow-500 text-white px-3 py-1 w-full" : "bg-blue-500 text-white px-3 py-1 w-full"}
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}