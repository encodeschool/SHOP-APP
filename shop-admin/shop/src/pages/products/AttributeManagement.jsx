import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const AttributeManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrType, setNewAttrType] = useState('STRING');
  const [newAttrOptions, setNewAttrOptions] = useState('');
  const [newAttrTranslations, setNewAttrTranslations] = useState([]);
  const [selectedAttrIndex, setSelectedAttrIndex] = useState(null);
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [translationName, setTranslationName] = useState('');

  useEffect(() => {
    axios.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  useEffect(() => {
    if (categoryId) fetchAttributes();
  }, [categoryId]);

  const fetchAttributes = async () => {
    try {
      const res = await axios.get(`/products/attributes/category/${categoryId}`);
      setAttributes(res.data);
    } catch (err) {
      console.error('Failed to fetch attributes', err);
    }
  };

  const addAttribute = () => {
    if (!newAttrName.trim()) return alert('Attribute name is required');

    const attr = {
      id: null,
      name: newAttrName,
      type: newAttrType,
      isRequired: false, // NEW: Added default value
      categoryId,
      options: newAttrType === 'DROPDOWN'
        ? newAttrOptions.split(',').map(o => o.trim()).filter(o => o)
        : [],
      translations: newAttrTranslations
    };

    setAttributes([...attributes, attr]);
    setNewAttrName('');
    setNewAttrType('STRING');
    setNewAttrOptions('');
    setNewAttrTranslations([]);
  };

  const saveAttributes = async () => {
    if (!categoryId) return alert('Please select a category before saving attributes.');
    try {
      const savedAttributes = [];
      for (let attr of attributes) {
        if (attr.id) continue; // Skip already saved attributes
        const payload = {
          name: attr.name,
          type: attr.type,
          isRequired: attr.isRequired,
          categoryId: categoryId,
          options: attr.options,
          translations: attr.translations
        };
        const response = await axios.post('/products/create/attributes', payload);
        savedAttributes.push({ ...attr, id: response.data.id });
      }
      setAttributes(savedAttributes.length > 0 ? [...attributes.filter(a => a.id), ...savedAttributes] : attributes);
      alert('Attributes saved successfully');
      fetchAttributes();
    } catch (err) {
      console.error('Failed to save attributes', err);
      alert('Failed to save attributes');
    }
  };

  const deleteAttribute = (index) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
  };

  const addTranslation = () => {
    if (!translationLanguage.trim() || !translationName.trim()) {
      return alert('Language and translation name are required');
    }
    setNewAttrTranslations([
      ...newAttrTranslations,
      { language: translationLanguage, name: translationName }
    ]);
    setTranslationLanguage('');
    setTranslationName('');
  };

  const updateAttributeTranslations = async (index) => {
    if (!translationLanguage.trim() || !translationName.trim()) {
      return alert('Language and translation name are required');
    }
    const updatedAttributes = [...attributes];
    const attr = updatedAttributes[index];
    const newTranslation = { language: translationLanguage, name: translationName };
    
    if (attr.id) {
      try {
        await axios.post(`/products/attributes/translations?attributeId=${attr.id}`, [
          ...attr.translations.filter(t => t.language !== translationLanguage),
          newTranslation
        ]);
        alert('Translation updated successfully');
        fetchAttributes(); // Refresh attributes to get updated translations
      } catch (err) {
        console.error('Failed to update translations', err);
        alert('Failed to update translations');
      }
    } else {
      attr.translations = [
        ...attr.translations.filter(t => t.language !== translationLanguage),
        newTranslation
      ];
      setAttributes(updatedAttributes);
    }
    setTranslationLanguage('');
    setTranslationName('');
    setSelectedAttrIndex(null);
  };

  const deleteTranslation = (attrIndex, transIndex) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[attrIndex].translations.splice(transIndex, 1);
    setAttributes(updatedAttributes);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Product Attributes</h2>

      {/* Category Selector */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Select Category:</label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {categoryId && (
        <>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Attributes</h3>
          <ul className="space-y-4 mb-6">
            {attributes.map((attr, i) => (
              <li key={i} className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  type="text"
                  value={attr.name}
                  onChange={e => {
                    const newAttrs = [...attributes];
                    newAttrs[i].name = e.target.value;
                    setAttributes(newAttrs);
                  }}
                  className="flex-1 border px-3 py-2 rounded w-full"
                  placeholder="Attribute name"
                />

                <select
                  value={attr.type}
                  onChange={e => {
                    const newAttrs = [...attributes];
                    newAttrs[i].type = e.target.value;
                    setAttributes(newAttrs);
                  }}
                  className="border px-3 py-2 rounded w-full md:w-40"
                >
                  <option value="STRING">Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="DROPDOWN">Dropdown</option>
                </select>

                {attr.type === 'DROPDOWN' && (
                  <input
                    type="text"
                    value={attr.options?.join(', ') || ''}
                    onChange={e => {
                      const newAttrs = [...attributes];
                      newAttrs[i].options = e.target.value.split(',').map(o => o.trim());
                      setAttributes(newAttrs);
                    }}
                    placeholder="Options (comma separated)"
                    className="flex-1 border px-3 py-2 rounded w-full"
                  />
                )}

                <button
                  onClick={() => setSelectedAttrIndex(i)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  title="Manage Translations"
                >
                  🌐
                </button>

                <button
                  onClick={() => deleteAttribute(i)}
                  className="text-red-500 hover:text-red-700 text-lg ml-2"
                  title="Delete"
                >
                  ❌
                </button>

                {attr.translations && attr.translations.length > 0 && (
                  <div className="ml-4 mt-2">
                    <h4 className="text-sm font-medium">Translations:</h4>
                    <ul className="space-y-1">
                      {attr.translations.map((trans, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span>{trans.language}: {trans.name}</span>
                          <button
                            onClick={() => deleteTranslation(i, j)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {selectedAttrIndex !== null && (
            <div className="mb-6 p-4 bg-gray-100 rounded">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Edit Translations for {attributes[selectedAttrIndex].name}
              </h4>
              <div className="flex flex-col gap-2 md:flex-row">
                <input
                  type="text"
                  value={translationLanguage}
                  onChange={e => setTranslationLanguage(e.target.value)}
                  placeholder="Language (e.g., en, ru, uz)"
                  className="border px-3 py-2 rounded w-full"
                />
                <input
                  type="text"
                  value={translationName}
                  onChange={e => setTranslationName(e.target.value)}
                  placeholder="Translated name"
                  className="border px-3 py-2 rounded w-full"
                />
                <button
                  onClick={() => updateAttributeTranslations(selectedAttrIndex)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add/Update Translation
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <h4 className="text-md font-medium text-gray-700">Add New Attribute</h4>
            <input
              type="text"
              value={newAttrName}
              onChange={e => setNewAttrName(e.target.value)}
              placeholder="Attribute name"
              className="w-full border px-3 py-2 rounded"
            />
            <select
              value={newAttrType}
              onChange={e => setNewAttrType(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="STRING">Text</option>
              <option value="NUMBER">Number</option>
              <option value="DROPDOWN">Dropdown</option>
            </select>
            {newAttrType === 'DROPDOWN' && (
              <input
                type="text"
                value={newAttrOptions}
                onChange={e => setNewAttrOptions(e.target.value)}
                placeholder="Options (comma separated)"
                className="w-full border px-3 py-2 rounded"
              />
            )}
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                type="text"
                value={translationLanguage}
                onChange={e => setTranslationLanguage(e.target.value)}
                placeholder="Language (e.g., en, ru, uz)"
                className="border px-3 py-2 rounded w-full"
              />
              <input
                type="text"
                value={translationName}
                onChange={e => setTranslationName(e.target.value)}
                placeholder="Translated name"
                className="border px-3 py-2 rounded w-full"
              />
              <button
                onClick={addTranslation}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add Translation
              </button>
            </div>
            {newAttrTranslations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Translations:</h4>
                <ul className="space-y-1">
                  {newAttrTranslations.map((trans, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span>{trans.language}: {trans.name}</span>
                      <button
                        onClick={() => {
                          setNewAttrTranslations(newAttrTranslations.filter((_, j) => j !== i));
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={addAttribute}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              ➕ Add Attribute
            </button>
          </div>

          <div className="text-right">
            <button
              onClick={saveAttributes}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              💾 Save Attributes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttributeManagement;