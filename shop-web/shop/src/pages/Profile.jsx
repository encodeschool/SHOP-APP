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

  useEffect(() => {
    const userId = localStorage.getItem('userId');

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
      const userId = localStorage.getItem('userId');
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
    const userId = localStorage.getItem('userId');
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
    const userId = localStorage.getItem('userId');
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <div className="flex gap-6 mb-6">
        {['profile', 'favorites', 'orders'].map((tab) => (
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
    </div>
  );
}
