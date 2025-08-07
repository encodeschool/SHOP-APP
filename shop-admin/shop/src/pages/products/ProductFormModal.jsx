import React, { useEffect, useState } from 'react';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isEditing,
  categories,
  subcategories,
  users,
  fetchAttributesFn
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    condition: 'NEW',
    categoryId: '',
    subcategoryId: '',
    userId: '',
    featured: false,
    images: []
  });

  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);

  useEffect(() => {
    if (product) {
      const {
        categoryId,
        category,
        title,
        description,
        price,
        stock,
        condition,
        userId,
        featured,
        attributes: attrVals
      } = product;

      const parentId = category?.parentId;
      const subId = parentId ? categoryId : '';
      const catId = parentId || categoryId;

      setForm({
        title,
        description,
        price,
        stock,
        condition,
        categoryId: catId,
        subcategoryId: subId,
        userId,
        featured,
        images: []
      });

      fetchAttributesFn(catId).then(attrs => {
        setAttributes(attrs);
        setAttributeValues(attrs.map(attr => {
          const match = attrVals?.find(a => a.attributeId === attr.id);
          return { attributeId: attr.id, value: match?.value || '' };
        }));
      });
    } else {
      setForm({
        title: '',
        description: '',
        price: '',
        stock: '',
        condition: 'NEW',
        categoryId: '',
        subcategoryId: '',
        userId: '',
        featured: false,
        images: []
      });
      setAttributeValues([]);
      setAttributes([]);
    }
  }, [product, isEditing, fetchAttributesFn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'categoryId') {
      fetchAttributesFn(value).then(attrs => {
        setAttributes(attrs);
        setAttributeValues(attrs.map(attr => ({
          attributeId: attr.id,
          value: ''
        })));
      });
    }
    if (name === 'subcategoryId') {
      fetchAttributesFn(value).then(attrs => {
        setAttributes(attrs);
        setAttributeValues(attrs.map(attr => ({
          attributeId: attr.id,
          value: ''
        })));
      });
    }
  };

  const handleAttributeChange = (index, value) => {
    const updated = [...attributeValues];
    updated[index].value = value;
    setAttributeValues(updated);
  };

  const handleImageChange = (e) => {
    setForm(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubmit = () => {
    const finalCategoryId = form.subcategoryId || form.categoryId;

    const payload = {
      ...form,
      categoryId: finalCategoryId,
      stock: parseInt(form.stock),
      price: parseFloat(form.price),
      attributes: attributeValues.filter(a => a.value !== '')
    };

    onSubmit(payload, form.images);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 w-[500px] rounded shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit' : 'Add'} Product</h2>

        <input name="title" placeholder="Title" className="border p-2 mb-3 w-full" value={form.title} onChange={handleChange} />
        <input name="description" placeholder="Description" className="border p-2 mb-3 w-full" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" className="border p-2 mb-3 w-full" value={form.price} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" className="border p-2 mb-3 w-full" value={form.stock} onChange={handleChange} />

        <select name="condition" className="border p-2 mb-3 w-full" value={form.condition} onChange={handleChange}>
          <option value="NEW">New</option>
          <option value="USED">Used</option>
        </select>

        <select name="categoryId" className="border p-2 mb-3 w-full" value={form.categoryId} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select name="subcategoryId" className="border p-2 mb-3 w-full" value={form.subcategoryId} onChange={handleChange}>
          <option value="">Select Subcategory</option>
          {subcategories.map(sc => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>

        <select name="userId" className="border p-2 mb-3 w-full" value={form.userId} onChange={handleChange}>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name || u.email}</option>
          ))}
        </select>

        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            className="mr-2"
            checked={form.featured}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                featured: e.target.checked
              }))
            }
          />
          Featured Product
        </label>

        {/* Attributes */}
        {attributes.map((attr, i) => (
          <div key={attr.id} className="mb-3">
            <label className="block mb-1 font-medium">
              {attr.name} {attr.isRequired ? '*' : ''}
            </label>
            {attr.type === 'DROPDOWN' ? (
              <select
                className="border p-2 w-full"
                value={attributeValues[i]?.value || ''}
                onChange={e => handleAttributeChange(i, e.target.value)}
              >
                <option value="">Select {attr.name}</option>
                {attr.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                className="border p-2 w-full"
                type={attr.type === 'NUMBER' ? 'number' : 'text'}
                value={attributeValues[i]?.value || ''}
                onChange={e => handleAttributeChange(i, e.target.value)}
              />
            )}
          </div>
        ))}

        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="border p-2 mb-4 w-full" />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
