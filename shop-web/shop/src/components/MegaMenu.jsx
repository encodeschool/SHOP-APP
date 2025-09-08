import React from 'react';
import { Link } from 'react-router-dom';

const MegaMenu = ({ categories, getLocalizedName, BASE_URL }) => {
  return (
    <div className="absolute left-0 right-0 bg-white text-black shadow-lg z-[100] flex p-6 rounded-b-xl border-t border-gray-200">
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col">
            <h3 className="text-lg font-bold text-indigo-500 mb-2">
              <Link to={`/category/${category.id}`} className="flex hover:underline">
                <img
                    src={
                    category.icon
                        ? `${BASE_URL}${category.icon}`
                        : '/placeholder.jpg'
                    }
                    alt={category.name}
                    className="w-[15px] object-contain w-full mr-2"
                />
                {getLocalizedName(category)}
              </Link>
            </h3>
            {category.subcategories?.length > 0 && (
              <ul className="list-none m-0 p-0">
                {category.subcategories.map((sub, subIndex) => (
                  <li key={`${sub.id}-${subIndex}`} className="mb-1">
                    <Link
                      to={`/category/${sub.id}`}
                      className="hover:underline text-gray-700"
                    >
                      {getLocalizedName(sub)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;