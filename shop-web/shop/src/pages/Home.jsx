import React, { useEffect, useState, useRef  } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import CarouselBanner from '../components/CarouselBanner';
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import FeatureStrip from '../components/FeatureStrip';
import FavoriteButton from '../components/FavoriteButton';
import CompareButton from '../components/CompareButton';


// Redux imports
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedSubImage, setSelectedSubImage] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const dispatch = useDispatch();

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
      const topCategories = res.data.filter(cat =>
        cat.subcategories && cat.subcategories.length > 0
      );
      setCategories(topCategories);
    };
    fetchCategories();
  }, []);

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


  const handleFavoriteToggle = async (productId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      alert('Please log in to add favorites.');
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await axios.delete(`/favorites`, {
          params: { userId, productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post(`/favorites`, null, {
          params: { userId, productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };



  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div>
      <div className="w-full bg-indigo-400 relative">
        <div className="container mx-auto flex gap-6 px-4 py-3 text-white text-base font-medium">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex relative"
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => {
                setHoveredCategory(null);
                setSelectedSubImage(null);
              }}
            >
              <img
                src={
                  category.icon
                    ? `http://localhost:8080${category.icon}`
                    : '/placeholder.jpg'
                }
                alt={category.name}
                className="w-[20px] invert-[100%] mr-2 object-contain"
              />
              <button className="hover:underline">{category.name}</button>

              {/* Mega Menu Dropdown */}
              {hoveredCategory?.id === category.id && (
                <div className="absolute top-full left-0 bg-white text-black shadow-lg z-50 flex p-6 mt-1 rounded w-auto">
                  <div className="grid gap-4 w-auto flex-1">
                    {category.subcategories?.map((sub) => (
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <CarouselBanner />
      
      <FeatureStrip />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl">All Products</h1>
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(product => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="relative border p-4 rounded-xl hover:shadow group"
            >
              <p className={product.condition === 'NEW' ? 'absolute top-0 px-3 py-1 rounded-tl-xl left-0 z-10 bg-green-600 text-white' : 'absolute top-0 px-3 py-1 left-0 z-10 bg-yellow-300 text-white rounded-tl-xl'}>{product.condition}</p>

              <button
                className={`absolute top-2 right-2 z-10 bg-white rounded-full p-3 ${
                  favorites.includes(product.id) ? 'text-red-500' : 'text-gray-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFavoriteToggle(product.id);
                }}
              >
                <FaHeart size={25} />
              </button>


              <img
                src={
                  product.imageUrls?.[0]
                    ? `http://localhost:8080${product.imageUrls[0]}`
                    : '/placeholder.jpg'
                }
                alt={product.title}
                className="h-40 object-contain w-full"
              />

              <div className="flex items-stretch justify-between">
                <div>
                  <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                  <p className="text-green-600">${product.price}</p>
                  <CompareButton product={product} />
                </div>
                <FavoriteButton
                  productId={product.id}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
                <button
                      className="bg-indigo-400 p-3 flex items-center justify-center absolute bottom-0 right-0 rounded-br-xl h-[50px] w-[50px] text-white hover:bg-indigo-500"
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
      </div>
      <div className="container mx-auto px-4 py-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl">Featured Products</h1>
        <div className="flex gap-2">
          <button ref={prevRef} className="swiper-button-prev-custom bg-indigo-400 p-2 px-4 text-white rounded-full hover:bg-indigo-600 hover:custor-pointer">
            ❮
          </button>
          <button ref={nextRef} className="swiper-button-prev-custom bg-indigo-400 p-2 px-4 text-white rounded-full hover:bg-indigo-600 hover:custor-pointer">
            ❯
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{ clickable: true }}
        className="pb-10" // adds bottom padding for pagination
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.filter(p => p.featured).length > 0 ? (
          products
            .filter(p => p.featured)
            .map(product => (
              <SwiperSlide key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  className="relative border p-4 rounded-xl hover:shadow group h-full block"
                >
                  <p
                    className={
                      product.condition === 'NEW'
                        ? 'absolute top-2 px-3 py-1 left-2 z-10 bg-green-600 text-white rounded'
                        : 'absolute top-2 px-3 py-1 left-2 z-10 bg-yellow-300 text-white rounded'
                    }
                  >
                    {product.condition}
                  </p>

                  <FavoriteButton
                    productId={product.id}
                    favorites={favorites}
                    setFavorites={setFavorites}
                  />


                  <img
                    src={
                      product.imageUrls?.[0]
                        ? `http://localhost:8080${product.imageUrls[0]}`
                        : '/placeholder.jpg'
                    }
                    alt={product.title}
                    className="h-40 object-contain w-full"
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                      <p className="text-green-600">${product.price}</p>
                    </div>
                    <button
                      className="bg-indigo-400 p-3 rounded-full text-white hover:bg-indigo-500"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <FaCartPlus size={15} />
                    </button>
                  </div>
                </Link>
              </SwiperSlide>
            ))
        ) : (
          <p className="text-center w-full">There are no featured products.</p>
        )}
      </Swiper>
    </div>

    </div>
  );
};

export default Home;
