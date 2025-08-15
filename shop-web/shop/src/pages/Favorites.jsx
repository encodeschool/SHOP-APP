import React, {useState, useEffect} from "react";
import axios from '../api/axios';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const token = localStorage.getItem('token');
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchFavorites = async () => {
            const userId = localStorage.getItem('userId');
            try {
                const res = await axios.get(`/favorites/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const favoriteItems = res.data;

                const productPromises = favoriteItems.map((fav) => 
                    axios.get(`/products/${fav.productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                    }).then(res => res.data)
                );

                const products = await Promise.all(productPromises);
                setFavorites(products);
            } catch (err) {
                console.log('Failed to fetch favorited: ', err);
            }
        };

        fetchFavorites();
    }, [token]);

    const handleRemoveFavorite = async (productId) => {
        const userId = localStorage.getItem('userId');
        try {
        await axios.delete(`${BASE_URL}/favorites`, {
            params: { userId, productId },
            headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(prev => prev.filter(p => p.id !== productId));
        } catch (err) {
        console.error('Failed to remove favorite:', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-3">
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
        </div>
    );
}