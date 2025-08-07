import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import DynamicAttributeForm from '../../components/DynamicAttributeForm';
import {Link} from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [brands, setBrands] = useState([]);

  const [newProduct, setNewProduct] = useState({
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
    brandId: '', // 👈 New
    attributes: []
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = () => {
    axios.get('/products')
      .then(res => setProducts(res.data))
      .catch(console.error);
  };

  const fetchBrands = () => {
    axios.get('/products/brands')
      .then(res => setBrands(res.data))
      .catch(console.error);
  };

  const fetchCategories = () => {
    axios.get('/categories')
      .then(res => {
        const rootCategories = res.data.filter(c => c.parentId === null);
        setCategories(rootCategories);
      })
      .catch(console.error);
  };

  const fetchSubcategories = (categoryId) => {
    axios.get(`/categories/${categoryId}/subcategories`)
      .then(res => setSubcategories(res.data || []))
      .catch(console.error);
  };

  const fetchAttributes = (categoryId) => {
    axios.get(`products/attributes/category/${categoryId}`)
      .then(res => {
        setAttributes(res.data || [])
      })
      .catch(console.error);
  };

  const fetchUsers = () => {
    axios.get('/users')
      .then(res => setUsers(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUsers();
    fetchBrands(); // 👈
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));

    if (name === 'categoryId') {
      const updated = { ...newProduct, categoryId: value, subcategoryId: '', attributes: [] };
      setNewProduct(updated);
      setAttributes([]);
      fetchSubcategories(value);
      fetchAttributes(value);
    }

    if (name === 'subcategoryId') {
      const effectiveCategoryId = value || newProduct.categoryId;
      setNewProduct(prev => ({ ...prev, subcategoryId: value }));
      fetchAttributes(effectiveCategoryId);
    }


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
    const {
      images,
      subcategoryId,
      categoryId,
      ...rest
    } = newProduct;

    const finalCategoryId = subcategoryId || categoryId;

    const productPayload = {
      ...rest,
      featured: newProduct.featured,
      categoryId: finalCategoryId,
      stock: parseInt(newProduct.stock),
      price: parseFloat(newProduct.price),
      attributes: newProduct.attributes,
      brandId: newProduct.brandId, // 👈 add this
    };

    formData.append('product', new Blob([JSON.stringify(productPayload)], {
      type: 'application/json'
    }));

    images.forEach(img => formData.append('images', img));

    if (editingId) {
      await axios.put(`/products/${editingId}`, productPayload);
    } else {
      const response = await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const createdProduct = response.data;
      setEditingId(createdProduct.id); // 👈 Automatically open attributes form
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
    });

    setAttributes([]);
    setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await axios.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (product) => {
    const parentCategoryId = product.category?.parentId;

    setNewProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      condition: product.condition,
      categoryId: parentCategoryId || product.categoryId,
      subcategoryId: parentCategoryId ? product.categoryId : '',
      userId: product.user?.id || '',
      featured: product.featured,
      images: [],
      attributes: product.attributes || [],
      brandId: product.brand?.id || '', // 👈
    });

    if (parentCategoryId) {
      fetchSubcategories(parentCategoryId);
    }

    const effectiveCategoryId = product.categoryId;
    fetchAttributes(effectiveCategoryId);


    setEditingId(product.id);
  };

  return (
    <div className="h-[100%]">
      <div className="flex gap-4 h-[100%]">
        <div className="w-[80%]">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          <div className="flex">
            <Link to="/product_attribute" className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Add Extra Attribute</Link>
            <Link to="/brand" className='bg-green-500 hover:bg-green-700 text-white font-bold ml-6 py-2 px-4 rounded'>Add brand</Link>
          </div>
          <table className="w-full border bg-white shadow mt-6">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Product Img</th>
                <th className="p-2">Title</th>
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
                    <img src={`http://localhost:8080${p.imageUrls[0]}`} alt={p.title} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 50 }} />
                  </td>
                  <td className="p-2">{p.title}</td>
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
        </div>

        <div className="w-[20%] p-4 bg-white shadow h-fit">
          <h3 className="font-semibold mb-2">{editingId ? 'Edit' : 'Add'} Product</h3>

          <input name="title" placeholder="Title" className="border p-1 mb-3 w-full" value={newProduct.title} onChange={handleInputChange} />
          <input name="description" placeholder="Description" className="border p-1 mb-3 w-full" value={newProduct.description} onChange={handleInputChange} />
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

          <select name="subcategoryId" className="border p-1 mb-3 w-full" value={newProduct.subcategoryId} onChange={handleInputChange}>
            <option value="">Select Subcategory</option>
            {subcategories.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.name}</option>
            ))}
          </select>

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
              categoryId={newProduct.subcategoryId || newProduct.categoryId}
              productId={editingId}
              onChange={handleDynamicAttributesChange}
            />
          )}



          <input
            type="checkbox"
            className="p-1 mb-3"
            checked={newProduct.featured}
            onChange={(e) =>
              setNewProduct((prev) => ({
                ...prev,
                featured: e.target.checked
              }))
            }
          /> Is Featured?

          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="border p-1 mb-3 w-full" />
          <button onClick={handleCreateOrUpdate} className={editingId ? "bg-yellow-500 text-white px-3 py-1 w-full" : "bg-blue-500 text-white px-3 py-1 w-full"}>
            {editingId ? 'Update' : 'Create'}
          </button>
          {/* {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewProduct(initialState);
                setAttributes([]);
              }}
              className="bg-gray-400 text-white px-3 py-1 w-full mt-2"
            >
              Cancel Edit
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}
