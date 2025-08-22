import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import DynamicAttributeForm from '../components/DynamicAttributeForm';
import { useTranslation } from "react-i18next";

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
    attributes: []
  });
  const userId = localStorage.getItem('userId');
  const [productImage, setProductImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchUserProducts();
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
    try {
      const res = await axios.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchSubcategories = (categoryId) => {
    const selectedCat = categories.find(cat => cat.id === categoryId);
    if (selectedCat && selectedCat.subcategories) {
      setSubcategories(selectedCat.subcategories);
    } else {
      setSubcategories([]);
      setSubsubcategories([]);
    }
  };

  const fetchSubsubcategories = () => {
    if (selectedSubcategory) {
      const selectedSub = subcategories.find(sub => sub.id === selectedSubcategory);
      if (selectedSub && selectedSub.subcategories) {
        setSubsubcategories(selectedSub.subcategories);
      } else {
        setSubsubcategories([]);
      }
    } else {
      setSubsubcategories([]);
    }
  };

  const fetchAttributes = (categoryId) => {
    axios.get(`/products/attributes/category/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setAttributes(res.data || []);
      })
      .catch(console.error);
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get('/products/brands', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(res.data);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  };

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
    fetchSubsubcategories();
  }, [selectedSubcategory, subcategories]);

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

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setNewProduct(prev => ({ ...prev, categoryId }));
    setSelectedSubcategory('');
    setNewProduct(prev => ({ ...prev, subcategoryId: '', subsubcategoryId: '' }));
    setAttributes([]);
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
      setSubsubcategories([]);
    }
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);
    setNewProduct(prev => ({ ...prev, subcategoryId, subsubcategoryId: '' }));
    setSubsubcategories([]);
    if (subcategoryId) {
      fetchAttributes(subcategoryId);
    }
  };

  const handleSubSubCategoryChange = (e) => {
    const subsubcategoryId = e.target.value;
    setNewProduct(prev => ({ ...prev, subsubcategoryId }));
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setNewProduct(prev => ({ ...prev, brandId }));
  };

  const handleDynamicAttributesChange = (attributeMap) => {
    // Ensure attributeMap is converted to an array of { attributeId, value } objects
    const attrs = Object.entries(attributeMap || {}).map(([attributeId, value]) => ({
      attributeId: attributeId,
      value: value
    }));
    setNewProduct(prev => ({ ...prev, attributes: attrs }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      'product',
      new Blob([JSON.stringify({
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        condition: newProduct.condition,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
        subsubcategoryId: newProduct.subsubcategoryId || '',
        userId: userId,
        featured: newProduct.featured,
        brandId: selectedBrand,
        attributes: newProduct.attributes || []
      })], { type: 'application/json' })
    );
    productImages.forEach((file) => {
      formData.append('images', file);
    });

    try {
      if (editingId) {
        await axios.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });
      }
      setNewProduct({
        title: '',
        description: '',
        price: '',
        stock: '',
        condition: 'NEW',
        categoryId: '',
        subcategoryId: '',
        subsubcategoryId: '',
        userId: userId || '',
        featured: false,
        images: [],
        brandId: '',
        attributes: []
      });
      setSelectedCategory('');
      setSelectedSubcategory('');
      setSelectedBrand('');
      setAttributes([]);
      setProductImages([]);
      setEditingId(null);
      fetchUserProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setMessage('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleEditProduct = async (product) => {
    setEditingId(product.id);
    setNewProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      condition: product.condition,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      subsubcategoryId: product.subsubcategoryId || '',
      userId: product.userId,
      featured: product.featured,
      brandId: product.brandId,
      attributes: product.attributes || []
    });
    setSelectedCategory(product.categoryId);
    try {
      fetchSubcategories(product.categoryId);
      setSelectedSubcategory(product.subcategoryId);
      if (product.subcategoryId) {
        const selectedSub = subcategories.find(sub => sub.id === product.subcategoryId);
        if (selectedSub && selectedSub.subcategories) {
          setSubsubcategories(selectedSub.subcategories);
        } else {
          setSubsubcategories([]);
        }
      }
      if (product.subcategoryId) {
        await fetchAttributes(product.subcategoryId);
      }
    } catch (err) {
      console.error('Failed to load subcategories or attributes:', err);
    }
    setSelectedBrand(product.brandId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">{t("My Account")}</h2>
      <div className="flex gap-6 mb-6">
        {['profile', 'favorites', 'orders', 'Product'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            {t(tab.charAt(0).toUpperCase() + tab.slice(1))}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <input
            type="text"
            name="name"
            placeholder={t("Full Name")}
            value={user.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder={t("Email")}
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="username"
            placeholder={t("Username")}
            value={user.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder={t("Phone")}
            value={user.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <div>
            <label>{t("Profile Picture")}:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="block mt-1"
            />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <button type="submit" className="bg-black text-white px-6 py-2 rounded">
            {t("Update Profile")}
          </button>
        </form>
      )}

      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.length === 0 ? (
            <p className="text-gray-600">{t("You don't have any favorite products yet")}.</p>
          ) : (
            favorites.map(product => (
              <div key={product.id} className="border p-4 rounded-xl relative">
                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={() => handleRemoveFavorite(product.id)}
                >
                  {t("Remove")} ❤️
                </button>
                <img
                  src={
                    product.imageUrls?.[0]
                      ? `${BASE_URL}${product.imageUrls[0]}`
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
            <p className="text-gray-600">{t("You have no orders yet")}.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="border p-4 rounded-lg">
                <h3 className="text-lg font-semibold">{t("Order ID")}: {order.id}</h3>
                <p>{t("Status")}: {order.status}</p>
                <p>{t("Created At")}: {new Date(order.createdAt).toLocaleString()}</p>
                <p>{t("Shipping Method")}: {order.shippingMethod}</p>
                <p>{t("Shipping Cost")}: ${order.shippingCost}</p>
                <p className="font-semibold">{t("Total")}: ${order.totalPrice}</p>
                <div className="mt-2">
                  <h4 className="font-medium">{t("Items")}:</h4>
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
              <p className="text-gray-600">{t("You haven't added any products yet")}.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border p-4 rounded-lg relative">
                    <button
                      className="absolute top-2 right-2 text-red-600"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      {t("Delete")}
                    </button>
                    <button
                      className="absolute top-2 right-14 text-blue-600"
                      onClick={() => handleEditProduct(product)}
                    >
                      {t("Edit")}
                    </button>
                    <img
                      src={
                        product.imageUrls?.[0]
                          ? `${BASE_URL}${product.imageUrls[0]}`
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
            <h3 className="text-lg font-semibold mb-2">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-2">
              <input
                type="text"
                name="title"
                placeholder={t("Title")}
                value={newProduct.title}
                onChange={handleNewProductChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                type="number"
                name="price"
                placeholder={t("Price")}
                value={newProduct.price}
                onChange={handleNewProductChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <textarea
                name="description"
                placeholder={t("Description")}
                value={newProduct.description}
                onChange={handleNewProductChange}
                className="w-full border px-2 py-1 rounded"
              />
              <select
                name="condition"
                value={newProduct.condition}
                onChange={handleNewProductChange}
                className="w-full border px-2 py-1 rounded"
                required
              >
                <option value="NEW">{t("NEW")}</option>
                <option value="USED">{t("USED")}</option>
              </select>
              <input
                type="number"
                name="stock"
                placeholder={t("Stock Quantity")}
                value={newProduct.stock}
                onChange={handleNewProductChange}
                className="w-full border px-2 py-1 rounded"
                min="0"
                required
              />
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full border px-2 py-1 rounded"
                required
              >
                <option value="">{t("Select Category")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {subcategories.length > 0 && (
                <select
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                >
                  <option value="">{t("Select Subcategory")}</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              )}
              {subsubcategories.length > 0 && (
                <select
                  value={newProduct.subsubcategoryId}
                  onChange={handleSubSubCategoryChange}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">{t("Select Sub-subcategory")}</option>
                  {subsubcategories.map((subsub) => (
                    <option key={subsub.id} value={subsub.id}>
                      {subsub.name}
                    </option>
                  ))}
                </select>
              )}
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                className="w-full border px-2 py-1 rounded"
                required
              >
                <option value="">{t("Select Brand")}</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {(selectedSubcategory || selectedCategory) && (
                <DynamicAttributeForm
                  categoryId={newProduct.subcategoryId || newProduct.categoryId}
                  productId={editingId}
                  onChange={handleDynamicAttributesChange}
                />
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full border px-2 py-1 rounded"
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