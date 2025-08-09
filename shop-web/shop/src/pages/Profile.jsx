import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '' });
  const userId = localStorage.getItem('userId');
  const [productImage, setProductImage] = useState(null);

  // New states for categories and brands, and selected category/brand
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Fetch categories and brands on mount
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:8080/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCategories(res.data))
        .catch((err) => console.error('Failed to fetch categories', err));

      axios
        .get('http://localhost:8080/api/products/brands', {
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
          const res = await axios.get(`http://localhost:8080/api/orders/user/${userId}`, {
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
          const res = await axios.get(`http://localhost:8080/api/favorites/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const favoriteItems = res.data;

          // Fetch product details for each favorite
          const productPromises = favoriteItems.map((fav) =>
            axios.get(`http://localhost:8080/api/products/${fav.productId}`, {
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
      await axios.delete(`http://localhost:8080/api/favorites`, {
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
        .get(`http://localhost:8080/api/users/${userId}`, {
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
      const res = await axios.put(`http://localhost:8080/api/users/update-profile`, formData, {
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
          const res = await axios.get(`http://localhost:8080/api/products/user/${userId}`, {
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

  const handleNewProductChange = (e) =>
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleBrandChange = (e) => setSelectedBrand(e.target.value);

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append(
      'product',
      new Blob(
        [
          JSON.stringify({
            ...newProduct,
            userId,
            categoryId: selectedCategory,
            brandId: selectedBrand,
          }),
        ],
        { type: 'application/json' }
      )
    );

    if (productImage) {
      formData.append('images', productImage);
    }

    try {
      await axios.post('http://localhost:8080/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewProduct({ title: '', price: '', description: '' });
      setSelectedCategory('');
      setSelectedBrand('');
      setProductImage(null);
      setActiveTab('Product'); // Refresh products list
    } catch (err) {
      console.error('Failed to add product', err);
    }
  };


  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Failed to delete product', err);
    }
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

          <div className="w-full lg:w-1/5 border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Add Product</h3>
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
              <input
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => setProductImage(e.target.files[0])}
                className="w-full"
              />
              <button type="submit" className="bg-black text-white w-full py-1 rounded">
                Create
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
