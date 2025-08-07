import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const AttributeManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrType, setNewAttrType] = useState('STRING');
  const [newAttrOptions, setNewAttrOptions] = useState('');

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
      categoryId,
      options: newAttrType === 'DROPDOWN'
        ? newAttrOptions.split(',').map(o => o.trim()).filter(o => o)
        : []
    };

    setAttributes([...attributes, attr]);
    setNewAttrName('');
    setNewAttrType('STRING');
    setNewAttrOptions('');
  };

  const saveAttributes = async () => {
    if (!categoryId) return alert('Please select a category before saving attributes.');
    try {
      for (let attr of attributes) {
        const payload = {
          ...attr,
          category: { id: categoryId }
        };
        await axios.post('/products/create/attributes', payload);
      }

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
                  onClick={() => deleteAttribute(i)}
                  className="text-red-500 hover:text-red-700 text-lg ml-2"
                  title="Delete"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          {/* Add New Attribute */}
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
