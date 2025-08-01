import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import CarouselBanner from '../components/CarouselBanner';
import {FaCartPlus,FaHeart  } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedSubImage, setSelectedSubImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('/products');
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get('/categories');

      // Only keep categories that have subcategories or no parent
      const topCategories = res.data.filter(cat =>
        cat.subcategories && cat.subcategories.length > 0
      );

      setCategories(topCategories);
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <CarouselBanner />
      <div className="w-full bg-orange-400 relative">
        <div className="container mx-auto flex gap-6 px-4 py-3 text-white text-base font-medium">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => {
                setHoveredCategory(null);
                setSelectedSubImage(null);
              }}
            >
              <button className="hover:underline">{category.name}</button>

              {/* Mega Menu Dropdown */}
              {hoveredCategory?.id === category.id && (
                <div className="absolute top-full left-0 bg-white text-black shadow-lg z-50 flex p-6 mt-1 rounded w-auto">
                  {/* Subcategories Columns */}
                  <div className="grid gap-4 w-auto flex-1">
                    {category.subcategories?.map((sub, idx) => (
                      <Link
                        key={sub.id}
                        to={`/category/${sub.id}`}
                        className="hover:underline"
                        onMouseEnter={() => setSelectedSubImage(sub.imageUrl)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>

                  {/* Subcategory Image Preview */}
                  {/* <div className="w-40 h-32 ml-6 flex-shrink-0">
                    {selectedSubImage && (
                      <img
                        src={selectedSubImage}
                        alt="preview"
                        className="w-full h-full object-cover rounded border"
                      />
                    )}
                  </div> */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className=' container mx-auto px-4 py-6'>
        <h1 className='text-xl'>All Products</h1>
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(product => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="relative border p-4 rounded-xl hover:shadow group"
            >
              <p className={product.condition === 'NEW' ? 'absolute top-2 px-3 py-1 left-2 z-10 bg-green-600 text-white rounded' : 'absolute top-2 px-3 py-1 left-2 z-10 bg-yellow-300 text-white rounded'}>{product.condition}</p>
              {/* Favorite Button */}
              <button
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-3 hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault(); // prevent navigating when clicking the button
                  // handleFavoriteToggle(product.id); // optional: implement later
                }}
              >
                <FaHeart size={25} />
              </button>

              {/* Product Image */}
              <img
                src={
                  product.imageUrls?.[0]
                    ? `http://localhost:8080${product.imageUrls[0]}`
                    : '/placeholder.jpg'
                }
                alt={product.title}
                className="h-40 object-contain w-full"
              />

              {/* Title, Price, Cart */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                  <p className="text-green-600">${product.price}</p>
                </div>
                <button className="bg-orange-400 p-3 rounded-full text-white">
                  <FaCartPlus size={15} />
                </button>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Home;