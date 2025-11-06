import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios"; // Use your centralized Axios
import { Link } from 'react-router-dom';
import { FaCartPlus, FaHeart, FaStar, FaRecycle } from 'react-icons/fa';
import FeatureStrip from '../components/FeatureStrip';
import FavoriteButton from '../components/FavoriteButton';
import CompareButton from '../components/CompareButton';

// Redux imports
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useTranslation } from "react-i18next";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery().get("q");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const dispatch = useDispatch();
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
          // Map to productId array
          const productIds = res.data.map(fav => fav.productId);
          setFavorites(productIds);
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, []);



  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };
  

  useEffect(() => {
    if (query) {
      axios.get(`/products/search?q=${query}`)
        .then(res => setResults(res.data))
        .catch(err => console.error("Search failed:", err));
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl mb-4">{t("Search Results for")}: <span className="font-bold">"{query}"</span></h2>
      {results.length === 0 ? (
        <p>{t("No products found")}.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map(product => (
            
            <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="relative border p-4 rounded-xl hover:shadow group h-full block"
                >
                  <p
                    className={`absolute top-0 px-3 py-1 flex items-center justify-center left-0 z-10 bg-gray-100 text-red-600 rounded-tl-xl`}
                  >
                    {product.condition === 'NEW' ? (
                      <>
                        <FaStar className="inline mr-1" />
                        {t("NEW")}
                      </>
                    ) : (
                      <>
                        <FaRecycle className="inline mr-1" />
                        {t("USED")}
                      </>
                    )}
                  </p>

                  <FavoriteButton
                    productId={product.id}
                    favorites={favorites}
                    setFavorites={setFavorites}
                  />


                  <img
                    src={
                      product.imageUrls?.[0]
                        ? `${BASE_URL}${product.imageUrls[0]}`
                        : '/placeholder.jpg'
                    }
                    alt={product.title}
                    className="h-40 object-contain w-full"
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                      <p className="text-red-600 text-3xl font-bold mt-2">${product.price}</p>
                      <CompareButton product={product} />
                    </div>
                    <button
                      className="bg-red-600 p-3 flex items-center justify-center absolute bottom-0 right-0 rounded-br-xl h-[50px] w-[50px] text-white hover:bg-red-600"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <FaCartPlus size={15} />
                    </button>
                  </div>
                </Link>
          ))}
        </div>
      )}
    </div>
  );
}
