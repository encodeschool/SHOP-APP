import React, {useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import axios from '../api/axios';


const ProductCard = ({ product }) => {
  const [favorites, setFavorites] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
      
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
  const isOutOfStock = !product.available || (product.stock ?? 0) <= 0;

  return (
    <Link to={`/product/${product.id}`}>
      <div className={`border relative rounded shadow p-3 hover:shadow-md ${isOutOfStock ? 'opacity-70' : ''}`}>
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
          className="w-full h-48 object-contain mb-2"
        />
        <div className="mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {isOutOfStock ? 'Out of stock' : 'In stock'}
          </span>
        </div>
        <h2 className="font-bold text-lg">{product.title}</h2>
        <p className="text-green-600">{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
