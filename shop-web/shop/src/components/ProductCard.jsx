import React, {useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import axios from '../api/axios';


const ProductCard = ({ product }) => {
  const [favorites, setFavorites] = useState([]);
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
  return (
    <Link to={`/product/${product.id}`}>
      <div className="border relative rounded shadow p-3 hover:shadow-md">
        <FavoriteButton
          productId={product.id}
          favorites={favorites}
          setFavorites={setFavorites}
        />
        <img
          src={
            product.imageUrls?.[0]
              ? `https://shop.encode.uz${product.imageUrls[0]}`
              : '/placeholder.jpg'
          }
          alt={product.title}
          className="w-full h-48 object-contain mb-2"
        />
        <h2 className="font-bold text-lg">{product.title}</h2>
        <p className="text-green-600">${product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
