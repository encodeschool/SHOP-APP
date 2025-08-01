import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <img
        src={
          product.imageUrls?.[0]
            ? `http://localhost:8080${product.imageUrls[0]}`
            : '/placeholder.jpg'
        }
        alt={product.title}
        className="h-40 object-cover w-full"
      />
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
      <p className="text-green-600 text-xl mb-2">${product.price}</p>
      <p className="mb-4">{product.description}</p>
      <button className="bg-black text-white px-4 py-2 rounded">Add to Cart</button>
    </div>
  );
};

export default ProductDetail;