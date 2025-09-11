import { useEffect, useState } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { setSort } from '../redux/filterSlice';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';

import { FaCartPlus } from 'react-icons/fa';
import FavoriteButton from '../components/FavoriteButton';

// Redux imports
import { addToCart } from '../redux/cartSlice';
import { useTranslation } from "react-i18next";

export default function FilterPage() {
  const dispatch = useDispatch();
  const { brands = [], inStock = false, priceRange = [0, 220], sort = 'default' } = useSelector((state) => state.filters || {});
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Add state for current page
  const [totalPages, setTotalPages] = useState(0); // Add state for total pages
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (userId && token) {
        try {
          const res = await axios.get(`/favorites/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const productIds = res.data.map(fav => fav.productId);
          setFavorites(productIds);
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteToggle = async (productId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      alert('Please log in to add favorites.');
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await axios.delete(`/favorites`, {
          params: { userId, productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post(`/favorites`, null, {
          params: { userId, productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Sync URL sort param -> Redux state
  useEffect(() => {
    if (searchParams.has('sort')) {
      dispatch(setSort(searchParams.get('sort')));
    }
  }, [searchParams, dispatch]);

  // Fetch products whenever filters or page number change
  useEffect(() => {
      const fetchFilteredProducts = async () => {
          try {
              const params = new URLSearchParams();

              if (brands.length) brands.forEach((b) => params.append('brands', b));
              if (inStock) params.set('inStock', true);
              if (priceRange[1] < 220) params.set('maxPrice', priceRange[1]);
              if (sort && sort !== 'default') params.set('sort', sort);

              params.set('page', currentPage);
              params.set('size', 12);

              const res = await axios.get(`/products/filtered?${params.toString()}`);
              setProducts(res.data.content);
              setTotalPages(res.data.totalPages);
          } catch (err) {
              console.error('Failed to fetch filtered products:', err);
          }
      };

      fetchFilteredProducts();
  }, [brands, inStock, priceRange, sort, currentPage]); // <-- 'sort' is added here

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row my-5 gap-6 container mx-auto px-4 py-3">
      <div className="w-full md:w-64">
        <FilterSidebar />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">{t("Collectible Figures")}</h1>
          <select
            className="border px-3 py-2 rounded"
            value={sort}
            onChange={(e) => dispatch(setSort(e.target.value))}
          >
            <option value="default">{t("Default sorting")}</option>
            <option value="price-asc">{t("Sort by price: low to high")}</option>
            <option value="price-desc">{t("Sort by price: high to low")}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border relative items-center grid grid-cols-2 justify-between p-4 rounded-xl shadow">
              <div className="mr-3 img_wrapper">
                <img
                  src={
                    p.imageUrls?.[0]
                      ? `${BASE_URL}${p.imageUrls[0]}`
                      : '/placeholder.jpg'
                  }
                  alt={p.title}
                  className="h-40 object-contain"
                />
              </div>
              <div className="content_wrapper p-2">
                <h2 className="font-bold">{p.title}</h2>
                <p className='text-red-800 text-3xl font-bold mt-2'>€{p.price.toFixed(2)}</p>
                <button
                  className="flex items-center absolute bottom-0 right-0 bg-red-800 p-5 rounded-br-xl rounded-2 text-white hover:bg-red-800"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(p);
                  }}
                >
                  <FaCartPlus size={15} />
                </button>
              </div>
              <FavoriteButton
                productId={p.id}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            </div>
          ))}
          {products.length === 0 && <p>{t("No products found.")}</p>}
        </div>

        {/* --- Pagination Controls --- */}
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`px-4 py-2 border rounded-lg ${currentPage === index ? 'bg-red-800 text-white' : 'hover:bg-gray-100'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {/* --------------------------- */}

      </div>
    </div>
  );
}