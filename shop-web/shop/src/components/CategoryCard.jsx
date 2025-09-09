import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL || '';
  return (
    <Link to={`/category/${category.id}`}>
      <div className="border rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col items-center p-6 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-700">
            {/* Displaying an icon if available, or a fallback */}
            {category.icon? (
              <img
                    src={
                    category.icon
                        ? `${BASE_URL}${category.icon}`
                        : '/placeholder.jpg'
                    }
                    alt={category.name}
                    className="w-[35px] object-contain"
              />
            ) : (
              <span></span> // Placeholder emoji
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
