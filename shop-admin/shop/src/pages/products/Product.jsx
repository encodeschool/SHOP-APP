import { useEffect, useState } from 'react';
import axios from '../../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [users, setUsers] = useState([]);

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    condition: 'NEW',
    categoryId: '',
    subcategoryId: '',
    userId: '',
    images: []
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = () => {
    axios.get('/products')
      .then(res => setProducts(res.data))
      .catch(console.error);
  };

  const fetchCategories = () => {
    axios.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  };

  const fetchSubcategories = (categoryId) => {
    axios.get(`/categories/${categoryId}/subcategories`)
      .then(res => setSubcategories(res.data))
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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));

    if (name === 'categoryId') {
      setNewProduct(prev => ({ ...prev, subcategoryId: '' }));
      fetchSubcategories(value);
    }
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, images: Array.from(e.target.files) });
  };

  const handleCreateOrUpdate = async () => {
    const formData = new FormData();
    const { images, ...productData } = newProduct;

    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
    images.forEach(img => formData.append('images', img));

    if (editingId) {
      await axios.put(`/products/${editingId}`, productData);
    } else {
      await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    setNewProduct({ title: '', description: '', price: '', stock: '', condition: 'NEW', categoryId: '', subcategoryId: '', userId: '', images: [] });
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
    setNewProduct({ ...product, images: [] });
    setEditingId(product.id);
    if (product.categoryId) {
      fetchSubcategories(product.categoryId);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Products</h2>

      <div className="mb-6 bg-white p-4 shadow">
        <h3 className="font-semibold mb-2">{editingId ? 'Edit' : 'Add'} Product</h3>
        <input name="title" placeholder="Title" className="border p-1 m-1" value={newProduct.title} onChange={handleInputChange} />
        <input name="description" placeholder="Description" className="border p-1 m-1" value={newProduct.description} onChange={handleInputChange} />
        <input name="price" type="number" placeholder="Price" className="border p-1 m-1" value={newProduct.price} onChange={handleInputChange} />
        <input name="stock" type="number" placeholder="Stock" className="border p-1 m-1" value={newProduct.stock} onChange={handleInputChange} />
        <select name="condition" className="border p-1 m-1" value={newProduct.condition} onChange={handleInputChange}>
          <option value="NEW">New</option>
          <option value="USED">Used</option>
        </select>

        <select name="categoryId" className="border p-1 m-1" value={newProduct.categoryId} onChange={handleInputChange}>
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select name="subcategoryId" className="border p-1 m-1" value={newProduct.subcategoryId} onChange={handleInputChange}>
          <option value="">Select Subcategory</option>
          {subcategories.map(sc => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>

        <select name="userId" className="border p-1 m-1" value={newProduct.userId} onChange={handleInputChange}>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name || u.email}</option>
          ))}
        </select>

        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="m-1" />
        <button onClick={handleCreateOrUpdate} className="bg-blue-500 text-white px-3 py-1 ml-2">{editingId ? 'Update' : 'Create'}</button>
      </div>

      <table className="w-full border bg-white shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Condition</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="p-2">{p.title}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">{p.condition}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 py-1 text-sm mr-1">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
