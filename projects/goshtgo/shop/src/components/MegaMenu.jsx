import React from 'react';
import { Link } from 'react-router-dom';
import { RiDiscountPercentLine } from "react-icons/ri";

const MegaMenu = ({ categories, getLocalizedName, BASE_URL }) => {
  return (
    <div className="absolute left-0 right-0 bloody text-white shadow-lg z-[100] flex flex-wrap p-6 rounded-b-xl">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">
              <Link to={`/category/${category.id}`} className="flex hover:underline">
                <img
                    src={
                    category.icon
                        ? `${BASE_URL}${category.icon}`
                        : '/placeholder.jpg'
                    }
                    alt={category.name}
                    className="w-[15px] invert-[100%] object-contain mr-2"
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
                      className="hover:underline text-gray-200"
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
      <div className='relative hidden md:block'>
        <img src="https://primemeat.ru/local/templates/primemeat/static/images/menu__banner-img-1.webp" className='object-cover' alt="" />
        <div className="absolute left-0 right-0 text-[24px] uppercase justify-between w-full bottom-0 box px-2 py-3 bg-yellow-300 flex items-center">
          <RiDiscountPercentLine size={80} className='mx-4' />
          <p>Subscribe for discounts</p>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;