import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

// Dummy DynamicAttributeForm for demonstration
function DynamicAttributeForm({ attributes, values, onChange }) {
  return (
    <div>
      {attributes.map((attr) => (
        <div key={attr.id} className="mb-2">
          <label className="block font-medium">{attr.name}:</label>
          <input
            type="text"
            value={values?.[attr.id] || ''}
            onChange={(e) => onChange(attr.id, e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      ))}
    </div>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    profileImage: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', attributes: {}, });
  const userId = localStorage.getItem('userId');
  const [productImage, setProductImage] = useState(null);

  // New states for categories and brands, and selected category/brand
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // fetch functions (similar to Products.jsx)
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchUserProducts(); // your seller products
  }, []);

  const fetchUserProducts = async () => {
    if (!userId || !token) return;
    try {
      const res = await axios.get(`/products/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch user products:', err);
    }
  };


  const fetchCategories = async () => {
    const res = await axios.get('/categories');
    setCategories(res.data);
  };
  const fetchSubcategories = async (categoryId) => {
    const res = await axios.get(`/categories/${categoryId}/subcategories`);
    setSubcategories(res.data);
  };
  const fetchAttributes = async (subcategoryId) => {
    const res = await axios.get(`/products/attributes/category/${subcategoryId}`);
    setAttributes(res.data);
  };
  const fetchBrands = async () => {
    const res = await axios.get('/products/brands');
    setBrands(res.data);
  };

  // Fetch categories and brands on mount
  useEffect(() => {
    if (token) {
      axios
        .get('/categories', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCategories(res.data))
        .catch((err) => console.error('Failed to fetch categories', err));

      axios
        .get('/products/brands', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBrands(res.data))
        .catch((err) => console.error('Failed to fetch brands', err));
    }
  }, [token]);

  useEffect(() => {
    

    const fetchOrders = async () => {
      if (activeTab === 'orders' && userId && token) {
        try {
          const res = await axios.get(`/orders/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(res.data);
        } catch (err) {
          console.error('Failed to fetch orders:', err);
        }
      }
    };

    fetchOrders();
  }, [activeTab, token]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeTab === 'favorites' && userId && token) {
        try {
          const res = await axios.get(`/favorites/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const favoriteItems = res.data;

          // Fetch product details for each favorite
          const productPromises = favoriteItems.map((fav) =>
            axios.get(`/products/${fav.productId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then(res => res.data)
          );

          const products = await Promise.all(productPromises);
          setFavorites(products);
        } catch (err) {
          console.error('Failed to fetch favorites:', err);
        }
      }
    };

    fetchFavorites();
  }, [activeTab, token]);

  const handleRemoveFavorite = async (productId) => {
    try {
      await axios.delete(`/favorites`, {
        params: { userId, productId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  useEffect(() => {
    if (userId && token) {
      axios
        .get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error('Failed to load user', err));
    }
  }, [token]);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const data = {
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
    };

    formData.append('data', JSON.stringify(data));
    if (profileImage) formData.append('profilePicture', profileImage);

    try {
      const res = await axios.put(`/users/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Profile updated successfully!');
      setUser(res.data);
    } catch (err) {
      setMessage('Failed to update profile');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (activeTab === 'Product') {
        try {
          const res = await axios.get(`/products/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProducts(res.data);
        } catch (err) {
          console.error('Failed to fetch products', err);
        }
      }
    };
    fetchProducts();
  }, [activeTab, token]);

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    setAttributes([]);
    if (categoryId) {
      fetchSubcategories(categoryId);
    }
  };

  // Handle subcategory change
  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);
    if (subcategoryId) {
      fetchAttributes(subcategoryId);
    }
  };
    
  // Handle brand change
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  // Handle dynamic attribute change
  const handleAttributeChange = (attrId, value) => {
    setNewProduct((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attrId]: value },
    }));
  };

  // Create or update product
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      'product',
      new Blob(
        [
          JSON.stringify({
            title: newProduct.title,
            price: parseFloat(newProduct.price),
            description: newProduct.description,
            categoryId: selectedCategory,
            subcategoryId: selectedSubcategory,
            brandId: selectedBrand,
            attributes: newProduct.attributes,
          }),
        ],
        { type: 'application/json' }
      )
    );
    productImages.forEach((file) => {
      formData.append('images', file);
    });

    try {
      if (editingId) {
        await axios.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setNewProduct({ title: '', price: '', description: '', attributes: {} });
      setSelectedCategory('');
      setSelectedSubcategory('');
      setSelectedBrand('');
      setAttributes([]);
      setProductImages([]);
      setEditingId(null);
      fetchUserProducts();
    } catch (err) {
      console.error('Error saving product', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      fetchUserProducts();
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  // Edit product (load data into form)
  const handleEditProduct = async (product) => {
    setEditingId(product.id);
    setNewProduct({
      title: product.title,
      price: product.price,
      description: product.description,
      attributes: product.attributes?.reduce((acc, attr) => {
        acc[attr.attributeId] = attr.value;
        return acc;
      }, {}) || {},
    });
    setSelectedCategory(product.categoryId);
    try {
      await fetchSubcategories(product.categoryId);
      setSelectedSubcategory(product.subcategoryId);
      await fetchAttributes(product.subcategoryId);
    } catch (err) {
      console.error('Failed to load subcategories or attributes', err);
    }
    setSelectedBrand(product.brandId);
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <div className="flex gap-6 mb-6">
        {['profile', 'favorites', 'orders', 'Product'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-black text-white' : 'bg-gray-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <div>
            <label>Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="block mt-1"
            />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <button type="submit" className="bg-black text-white px-6 py-2 rounded">
            Update Profile
          </button>
        </form>
      )}

      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.length === 0 ? (
            <p className="text-gray-600">You don't have any favorite products yet.</p>
          ) : (
            favorites.map(product => (
              <div key={product.id} className="border p-4 rounded-xl relative">
                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={() => handleRemoveFavorite(product.id)}
                >
                  Remove ❤️
                </button>
                <img
                  src={
                    product.imageUrls?.[0]
                      ? `http://localhost:8080${product.imageUrls[0]}`
                      : '/placeholder.jpg'
                  }
                  alt={product.title}
                  className="h-40 object-contain w-full"
                />
                <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                <p className="text-green-600">${product.price}</p>
              </div>
            ))
          )}
        </div>
      )}


      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-600">You have no orders yet.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="border p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
                <p>Status: {order.status}</p>
                <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Shipping Method: {order.shippingMethod}</p>
                <p>Shipping Cost: ${order.shippingCost}</p>
                <p className="font-semibold">Total: ${order.totalPrice}</p>

                <div className="mt-2">
                  <h4 className="font-medium">Items:</h4>
                  <ul className="list-disc ml-6">
                    {order.items.map((item, index) => (
                      <li key={`${order.id}-${index}`}>
                        {item.productTitle} × {item.quantity} — ${item.pricePerUnit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'Product' && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product List */}
          <div className="w-full lg:w-4/5">
            {products.length === 0 ? (
              <p className="text-gray-600">You haven't added any products yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border p-4 rounded-lg relative">
                    <button
                      className="absolute top-2 right-2 text-red-600"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="absolute top-2 right-14 text-blue-600"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <img
                      src={
                        product.imageUrls?.[0]
                          ? `http://localhost:8080${product.imageUrls[0]}`
                          : '/placeholder.jpg'
                      }
                      alt={product.title}
                      className="h-40 w-full object-contain mb-2"
                    />
                    <h3 className="font-semibold">{product.title}</h3>
                    <p>${product.price}</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Form */}
          <div className="w-full lg:w-1/5 border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-2">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newProduct.title}
                onChange={handleNewProductChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleNewProductChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleNewProductChange}
                className="w-full border px-2 py-1 rounded"
              />

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full border px-2 py-1 rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Subcategory */}
              {subcategories.length > 0 && (
                <select
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Brand */}
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                className="w-full border px-2 py-1 rounded"
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>

              {/* Attributes */}
              {attributes.length > 0 && (
                <DynamicAttributeForm
                  attributes={attributes}
                  values={newProduct.attributes}
                  onChange={handleAttributeChange}
                />
              )}

              {/* Images */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setProductImages(Array.from(e.target.files))}
              />

              {productImages.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {productImages.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}



              <button
                type="submit"
                className="bg-black text-white w-full py-1 rounded"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
