// src/components/DynamicAttributeForm.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function DynamicAttributeForm({ categoryId, onChange, productId }) {
  const [attributes, setAttributes] = useState([]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoryId) {
      axios.get(`/products/attributes/category/${categoryId}`).then((res) => {
        setAttributes(res.data);
        setValues({});
        setErrors({});
      });
    }
  }, [categoryId]);

  const handleChange = (id, value) => {
    const updatedValues = { ...values, [id]: value };
    setValues(updatedValues);
    setErrors((prev) => ({ ...prev, [id]: '' }));
    onChange(updatedValues); // call directly here
  };

  const validate = () => {
    const newErrors = {};
    attributes.forEach(attr => {
      if (attr.isRequired && !values[attr.id]) {
        newErrors[attr.id] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const attributeList = Object.entries(values).map(([attributeId, value]) => ({
      attributeId,
      value: String(value), // ensure checkbox true/false becomes string
    }));

    try {
      await axios.post('/products/attributes', attributeList, {
        params: { productId }, 
      });
      alert('Attributes submitted');
    } catch (err) {
      alert('Error submitting attributes');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {attributes.map((attr) => (
        <div key={attr.id}>
          <label className="block font-semibold mb-1">
            {attr.name} {attr.isRequired && '*'}
          </label>
          {attr.type === 'STRING' && (
            <input
              type="text"
              value={values[attr.id] || ''}
              onChange={(e) => handleChange(attr.id, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          )}
          {attr.type === 'NUMBER' && (
            <input
              type="number"
              value={values[attr.id] || ''}
              onChange={(e) => handleChange(attr.id, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          )}
          {attr.type === 'DROPDOWN' && (
            <select
              value={values[attr.id] || ''}
              onChange={(e) => handleChange(attr.id, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select an option</option>
              {attr.options?.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          {attr.type === 'CHECKBOX' && (
            <input
              type="checkbox"
              checked={values[attr.id] || false}
              onChange={(e) => handleChange(attr.id, e.target.checked)}
              className="mr-2"
            />
          )}
          {attr.type === 'DATE' && (
            <input
              type="date"
              value={values[attr.id] || ''}
              onChange={(e) => handleChange(attr.id, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          )}
          {errors[attr.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[attr.id]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save Attributes
      </button>
    </form>
  );
}
