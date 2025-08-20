import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import DynamicAttributeForm from '../../components/DynamicAttributeForm';
import { Link } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [attributes, setAttributes] = useState([]); // Fixed typo: setAttributes was missing
  const [brands, setBrands] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL || ''; // Fallback for BASE_URL

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    condition: 'NEW',
    categoryId: '',
    subcategoryId: '',
    subsubcategoryId: '',
    userId: '',
    featured: false,
    images: [],
    brandId: '',
    attributes: [],
    translations: [],
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = () => {
    setIsLoading(true);
    axios.get('/products')
      .then(res => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setProducts([]);
        setError('Failed to fetch products.');
        setIsLoading(false);
      });
  };

  const fetchBrands = () => {
    axios.get('/products/brands')
      .then(res => setBrands(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Error fetching brands:', err);
        setBrands([]);
      });
  };

  const fetchCategories = () => {
    axios.get('/categories')
      .then(res => {
        const rootCategories = Array.isArray(res.data) ? res.data.filter(c => c.parentId === null) : [];
        setCategories(rootCategories);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      });
  };

  const fetchSubcategories = (categoryId) => {
    axios.get(`/categories/${categoryId}/subcategories`)
      .then(res => setSubcategories(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Error fetching subcategories:', err);
        setSubcategories([]);
      });
  };

  const fetchAttributes = (categoryId) => {
    axios.get(`products/attributes/category/${categoryId}`)
      .then(res => setAttributes(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Error fetching attributes:', err);
        setAttributes([]);
      });
  };

  const fetchUsers = () => {
    axios.get('/users')
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Error fetching users:', err);
        setUsers([]);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUsers();
    fetchBrands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value ?? ''
    }));

    if (name === 'categoryId') {
      setNewProduct(prev => ({
        ...prev,
        categoryId: value,
        subcategoryId: '',
        subsubcategoryId: '',
        attributes: []
      }));
      const selectedCat = categories.find(c => c.id === value);
      setSubcategories(selectedCat?.subcategories || []);
      setSubsubcategories([]);
      fetchAttributes(value);
    }

    if (name === 'subcategoryId') {
      setNewProduct(prev => ({
        ...prev,
        subcategoryId: value,
        subsubcategoryId: '',
        attributes: []
      }));
      const selectedSubcat = subcategories.find(sc => sc.id === value);
      setSubsubcategories(selectedSubcat?.subcategories || []);
      fetchAttributes(value);
    }

    if (name === 'subsubcategoryId') {
      setNewProduct(prev => ({
        ...prev,
        subsubcategoryId: value
      }));
      fetchAttributes(value);
    }
  };

  const handleTranslationChange = (index, field, value) => {
    setNewProduct((prev) => {
      const updatedTranslations = [...prev.translations];
      updatedTranslations[index] = {
        ...updatedTranslations[index],
        [field]: value,
      };
      return { ...prev, translations: updatedTranslations };
    });
  };

  const addTranslation = () => {
    setNewProduct((prev) => ({
      ...prev,
      translations: [...prev.translations, { language: '', name: '', description: '' }],
    }));
  };

  const removeTranslation = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
  };

  const handleDynamicAttributesChange = (attributeMap) => {
    const attrs = Object.entries(attributeMap).map(([attributeId, value]) => ({
      attributeId,
      value
    }));
    setNewProduct(prev => ({ ...prev, attributes: attrs }));
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, images: Array.from(e.target.files) });
  };

  const handleCreateOrUpdate = async () => {
    const formData = new FormData();
    const { images, subcategoryId, categoryId, ...rest } = newProduct;

    const finalCategoryId = newProduct.subsubcategoryId || newProduct.subcategoryId || newProduct.categoryId;

    const productPayload = {
      ...rest,
      featured: newProduct.featured,
      categoryId: finalCategoryId,
      stock: parseInt(newProduct.stock),
      price: parseFloat(newProduct.price),
      attributes: newProduct.attributes,
      brandId: newProduct.brandId,
      translations: newProduct.translations,
    };

    formData.append('product', new Blob([JSON.stringify(productPayload)], {
      type: 'application/json'
    }));

    images.forEach(img => formData.append('images', img));

    try {
      if (editingId) {
        await axios.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const response = await axios.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const createdProduct = response.data;
        setEditingId(createdProduct.id);
      }

      setNewProduct({
        title: '',
        description: '',
        price: '',
        stock: '',
        condition: 'NEW',
        categoryId: '',
        subcategoryId: '',
        userId: '',
        featured: false,
        images: [],
        attributes: [],
        brandId: '',
        translations: [],
      });
      setAttributes([]);
      setEditingId(null);
      setIsDrawerOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product', err);
      setError('Failed to save product.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product.');
    }
  };

  const handleEdit = (product) => {
    const parentCategoryId = product.category?.parentId;

    setNewProduct({
      title: product.title || '',
      description: product.description || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      condition: product.condition || 'NEW',
      categoryId: parentCategoryId || product.categoryId || '',
      subcategoryId: parentCategoryId ? product.categoryId : '',
      userId: product.user?.id || '',
      featured: product.featured ?? false,
      images: [],
      attributes: (product.attributes || []).map(attr => ({
        attributeId: attr.attribute?.id || attr.attributeId,
        value: attr.value ?? ''
      })),
      brandId: product.brand?.id || '',
      translations: product.translations || [],
    });

    if (parentCategoryId) {
      fetchSubcategories(parentCategoryId);
    }

    const effectiveCategoryId = product.categoryId;
    fetchAttributes(effectiveCategoryId);

    setEditingId(product.id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="h-[100%]">
      <div className="flex gap-4 h-[100%]">
        <div className="w-[100%]">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          <div className="flex">
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 mr-6 px-4 rounded'
              onClick={() => {
                setEditingId(null);
                setNewProduct({
                  title: '',
                  description: '',
                  price: '',
                  stock: '',
                  condition: 'NEW',
                  categoryId: '',
                  subcategoryId: '',
                  userId: '',
                  featured: false,
                  images: [],
                  attributes: [],
                  brandId: '',
                  translations: [],
                });
                setIsDrawerOpen(true);
              }}
            >
              +
            </button>
            <Link to="/product_attribute" className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Add Extra Attribute</Link>
            <Link to="/brand" className='bg-green-500 hover:bg-green-700 text-white font-bold ml-6 py-2 px-4 rounded'>Add brand</Link>
          </div>
          {isLoading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <table className="w-full border bg-white shadow mt-6">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Product Img</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">English Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Condition</th>
                  <th className="p-2">Featured</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="p-2">
                      {p.imageUrls && p.imageUrls[0] ? (
                        <img src={`${BASE_URL}${p.imageUrls[0]}`} alt={p.title} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 50 }} />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td className="p-2">{p.title}</td>
                    <td className="p-2">
                      {p.translations?.find((t) => t.language === 'en')?.name || 'N/A'}
                    </td>
                    <td className="p-2">${p.price}</td>
                    <td className="p-2">{p.stock}</td>
                    <td className="p-2">{p.condition}</td>
                    <td className="p-2">{p.featured ? 'Yes' : 'No'}</td>
                    <td className="p-2">
                      <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 py-1 text-sm mr-1">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
            isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsDrawerOpen(false)}
        ></div>

        <div
          className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          } w-[100%] md:w-[500px] overflow-y-scroll`}
        >
          <div className="p-4">
            <div className="p-4 bg-white shadow h-fit">
              <h3 className="font-semibold mb-2">{editingId ? 'Edit' : 'Add'} Product</h3>

              <input name="title" placeholder="Title" className="border p-1 mb-3 w-full" value={newProduct.title || ''} onChange={handleInputChange} />
              <input name="description" placeholder="Description" className="border p-1 mb-3 w-full" value={newProduct.description} onChange={handleInputChange} />
              <div className="mb-3">
                <h4 className="font-semibold mb-2">Translations</h4>
                {newProduct.translations.map((translation, index) => (
                  <div key={index} className="border p-2 mb-2 rounded">
                    <select
                      className="border p-1 mb-2 w-full"
                      value={translation.language}
                      onChange={(e) => handleTranslationChange(index, 'language', e.target.value)}
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
                      onChange={(e) => handleTranslationChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Translated Description"
                      className="border p-1 mb-2 w-full"
                      value={translation.description}
                      onChange={(e) => handleTranslationChange(index, 'description', e.target.value)}
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

              <input name="price" type="number" placeholder="Price" className="border p-1 mb-3 w-full" value={newProduct.price} onChange={handleInputChange} />
              <input name="stock" type="number" placeholder="Stock" className="border p-1 mb-3 w-full" value={newProduct.stock} onChange={handleInputChange} />

              <select name="condition" className="border p-1 mb-3 w-full" value={newProduct.condition} onChange={handleInputChange}>
                <option value="NEW">New</option>
                <option value="USED">Used</option>
              </select>

              <select name="categoryId" className="border p-1 mb-3 w-full" value={newProduct.categoryId} onChange={handleInputChange}>
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {newProduct.categoryId && (
                <select name="subcategoryId" className="border p-1 mb-3 w-full" value={newProduct.subcategoryId} onChange={handleInputChange}>
                  <option value="">Select Subcategory</option>
                  {subcategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                </select>
              )}

              {newProduct.subcategoryId && (
                <select name="subsubcategoryId" className="border p-1 mb-3 w-full" value={newProduct.subsubcategoryId} onChange={handleInputChange}>
                  <option value="">Select Sub-subcategory</option>
                  {subsubcategories.map(ssc => <option key={ssc.id} value={ssc.id}>{ssc.name}</option>)}
                </select>
              )}

              <select name="userId" className="border p-1 mb-3 w-full" value={newProduct.userId} onChange={handleInputChange}>
                <option value="">Select User</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>

              <select name="brandId" className="border p-1 mb-3 w-full" value={newProduct.brandId} onChange={handleInputChange}>
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>

              {(editingId || newProduct.categoryId) && (
                <DynamicAttributeForm
                  categoryId={newProduct.subsubcategoryId || newProduct.subcategoryId || newProduct.categoryId}
                  productId={editingId}
                  onChange={handleDynamicAttributesChange}
                />
              )}

              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={newProduct.featured}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      featured: e.target.checked
                    }))
                  }
                />
                Is Featured?
              </label>

              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="border p-1 mb-3 w-full" />

              <button onClick={handleCreateOrUpdate} className={editingId ? "bg-yellow-500 text-white px-3 py-1 w-full" : "bg-blue-500 text-white px-3 py-1 w-full"}>
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}