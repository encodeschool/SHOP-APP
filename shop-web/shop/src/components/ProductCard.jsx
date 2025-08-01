import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="border rounded shadow p-3 hover:shadow-md">
        <img
          src={
            product.imageUrls?.[0]
              ? `http://localhost:8080${product.imageUrls[0]}`
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
