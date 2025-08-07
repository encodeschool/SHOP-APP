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
    // Fetch all categories
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
    if (!categoryId) {
      return alert('Please select a category before saving attributes.');
    }
    try {
      for (let attr of attributes) {
        const payload = {
          ...attr,
          category: { id: categoryId }  // ✅ backend expects this format
        };
        console.log("Payload " + payload)
        
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
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <h2>Manage Product Attributes</h2>

      {/* Category Selector */}
      <div>
        <label>Select Category:</label>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Attributes List */}
      {categoryId && (
        <>
          <h3>Attributes for Category</h3>
          <ul>
            {attributes.map((attr, i) => (
              <li key={i} style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  value={attr.name}
                  placeholder="Attribute name"
                  onChange={e => {
                    const newAttrs = [...attributes];
                    newAttrs[i].name = e.target.value;
                    setAttributes(newAttrs);
                  }}
                />
                <select
                  value={attr.type}
                  onChange={e => {
                    const newAttrs = [...attributes];
                    newAttrs[i].type = e.target.value;
                    setAttributes(newAttrs);
                  }}
                >
                  <option value="STRING">Text</option>
                  <option value="NUMBER">NUMBER</option>
                  <option value="DROPDOWN">DROPDOWN</option>
                </select>
                {attr.type === 'DROPDOWN' && (
                  <input
                    type="text"
                    placeholder="Options (comma separated)"
                    value={attr.options?.join(', ') || ''}
                    onChange={e => {
                      const newAttrs = [...attributes];
                      newAttrs[i].options = e.target.value.split(',').map(o => o.trim());
                      setAttributes(newAttrs);
                    }}
                  />
                )}
                <button onClick={() => deleteAttribute(i)}>❌</button>
              </li>
            ))}
          </ul>

          {/* Add New Attribute */}
          <h4>Add New Attribute</h4>
          <input
            type="text"
            placeholder="Attribute name"
            value={newAttrName}
            onChange={e => setNewAttrName(e.target.value)}
          />
          <select value={newAttrType} onChange={e => setNewAttrType(e.target.value)}>
            <option value="STRING">Text</option>
            <option value="NUMBER">NUMBER</option>
            <option value="DROPDOWN">DROPDOWN</option>
          </select>
          {newAttrType === 'DROPDOWN' && (
            <input
              type="text"
              placeholder="Options (comma separated)"
              value={newAttrOptions}
              onChange={e => setNewAttrOptions(e.target.value)}
            />
          )}
          <button onClick={addAttribute}>➕ Add Attribute</button>

          <hr />
          <button onClick={saveAttributes}>💾 Save Attributes</button>
        </>
      )}
    </div>
  );
};

export default AttributeManagement;
