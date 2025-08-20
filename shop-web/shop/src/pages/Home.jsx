import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import CarouselBanner from '../components/CarouselBanner';
import { FaCartPlus, FaHeart, FaStar, FaRecycle } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import FeatureStrip from '../components/FeatureStrip';
import FavoriteButton from '../components/FavoriteButton';
import CompareButton from '../components/CompareButton';
import { useLoading } from '../contexts/LoadingContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [selectedSubImage, setSelectedSubImage] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [brands, setBrands] = useState([]);
  const { t, i18n } = useTranslation(); // 🔹 Add useTranslation hook
  const brandPrevRef = useRef(null);
  const brandNextRef = useRef(null);
  const featuredPrevRef = useRef(null);
  const featuredNextRef = useRef(null);
  const { setLoading } = useLoading();
  const dispatch = useDispatch();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Fetch products with language parameter
  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/products/lang?lang=${i18n.language}`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [i18n.language, setLoading]); // 🔹 Add i18n.language to dependencies

  useEffect(() => {
    setLoading(true);
    const fetchBrands = async () => {
      try {
        const res = await axios.get('/products/brands');
        setBrands(res.data);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [setLoading]);

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/categories');
        const rootCategories = res.data.filter(
          (cat) => cat.parentId === null && cat.subcategories && cat.subcategories.length > 0
        );
        setCategories(rootCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [setLoading]);

  useEffect(() => {
    setLoading(true);
    const fetchFavorites = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (userId && token) {
        try {
          const res = await axios.get(`/favorites/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const productIds = res.data.map((fav) => fav.productId);
          setFavorites(productIds);
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFavorites();
  }, [setLoading]);

  const handleFavoriteToggle = async (productId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      alert(t('Please log in to add favorites.'));
      return;
    }
    try {
      if (favorites.includes(productId)) {
        await axios.delete(`/favorites`, {
          params: { userId, productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(`/favorites`, null, {
          params: { userId, productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => [...prev, productId]);
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
                setHoveredSubcategory(null);
                setSelectedSubImage(null);
              }}
            >
              <img
                src={
                  category.icon
                    ? `${BASE_URL}${category.icon}`
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
                      <div
                        key={sub.id}
                        className="relative"
                        onMouseEnter={() => setHoveredSubcategory(sub)}
                        onMouseLeave={() => setHoveredSubcategory(null)}
                      >
                        <Link
                          to={`/category/${sub.id}`}
                          className="hover:underline"
                          onMouseEnter={() => setSelectedSubImage(sub.imageUrl)}
                        >
                          {sub.name}
                        </Link>
                        {hoveredSubcategory?.id === sub.id && sub.subcategories?.length > 0 && (
                          <div className="absolute left-full top-0 bg-white text-black shadow-lg p-4 rounded ml-2 w-fit">
                            {sub.subcategories.map((subsub) => (
                              <Link
                                key={subsub.id}
                                to={`/category/${subsub.id}`}
                                className="block hover:underline py-1"
                              >
                                {subsub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedSubImage && (
                    <div className="ml-4">
                      <img
                        src={`${BASE_URL}${selectedSubImage}`}
                        alt="Subcategory"
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <CarouselBanner />

      <FeatureStrip />

      <div className="container mx-auto px-4 py-6">
        <h1 className="w-fit border-b-[4px] border-indigo-400 text-xl">{t('All Products')}</h1>
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="relative border p-4 rounded-xl hover:shadow group"
            >
              <p
                className={`absolute top-0 px-3 flex items-center justify-center py-1 left-0 z-10 bg-gray-100 text-indigo-400 rounded-tl-xl`}
              >
                {product.condition === 'NEW' ? (
                  <>
                    <FaStar className="inline mr-1" />
                    {t('NEW')}
                  </>
                ) : (
                  <>
                    <FaRecycle className="inline mr-1" />
                    {t('USED')}
                  </>
                )}
              </p>
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
                    ? `${BASE_URL}${product.imageUrls[0]}`
                    : '/placeholder.jpg'
                }
                alt={product.title}
                className="h-40 object-contain w-full"
              />
              <div className="flex items-stretch justify-between">
                <div>
                  <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                  <p className="text-indigo-600 text-3xl font-bold mt-2">${product.price}</p>
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
          <h1 className="border-b-[4px] border-indigo-400 text-xl">{t('Our Brands')}</h1>
          <div className="flex gap-2">
            <button
              ref={brandPrevRef}
              className="swiper-button-prev-custom bg-indigo-400 p-2 px-4 text-white rounded-full hover:bg-indigo-600 hover:cursor-pointer"
            >
              ❮
            </button>
            <button
              ref={brandNextRef}
              className="swiper-button-next-custom bg-indigo-400 p-2 px-4 text-white rounded-full hover:bg-indigo-600 hover:cursor-pointer"
            >
              ❯
            </button>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: brandPrevRef.current,
            nextEl: brandNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = brandPrevRef.current;
            swiper.params.navigation.nextEl = brandNextRef.current;
          }}
          pagination={{ clickable: true }}
          className="pb-10"
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 6 },
          }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <Link to="/filtered">
                <div className="p-[50px] w-full h-[150px] border-[3px] border-indigo-400 rounded-xl hover:shadow">
                  <div
                    className="bg-contain h-[100%] grayscale bg-no-repeat bg-center"
                    style={{
                      backgroundImage: `url(${
                        brand.icon ? `${BASE_URL}${brand.icon}` : '/placeholder.jpg'
                      })`,
                    }}
                  ></div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="border-b-[4px] border-indigo-400 text-xl">{t('Featured Products')}</h1>
          <div className="flex gap-2">
            <button
              ref={featuredPrevRef}
              className="swiper-button-prev-custom bg-indigo-400 p-2 px-4 text-white rounded-full hover:bg-indigo-600 hover:cursor-pointer"
            >
              ❮
            </button>
            <button
              ref={featuredNextRef}
              className="swiper-button-next-custom bg-indigo-400 p-2 px-4 text-white rounded-full hover:bg-indigo-600 hover:cursor-pointer"
            >
              ❯
            </button>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: featuredPrevRef.current,
            nextEl: featuredNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = featuredPrevRef.current;
            swiper.params.navigation.nextEl = featuredNextRef.current;
          }}
          pagination={{ clickable: true }}
          className="pb-10"
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products.filter((p) => p.featured).length > 0 ? (
            products
              .filter((p) => p.featured)
              .map((product) => (
                <SwiperSlide key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    className="relative border p-4 rounded-xl hover:shadow group h-full block"
                  >
                    <p
                      className="absolute top-0 px-3 py-1 flex items-center justify-center left-0 z-10 bg-gray-100 text-indigo-400 rounded-tl-xl"
                    >
                      {product.condition === 'NEW' ? (
                        <>
                          <FaStar className="inline mr-1" />
                          {t('NEW')}
                        </>
                      ) : (
                        <>
                          <FaRecycle className="inline mr-1" />
                          {t('USED')}
                        </>
                      )}
                    </p>
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
                      className="h-40 object-contain w-full"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                        <p className="text-indigo-600 text-3xl font-bold mt-2">${product.price}</p>
                        <CompareButton product={product} />
                      </div>
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
                </SwiperSlide>
              ))
          ) : (
            <SwiperSlide>
              <p className="text-center w-full">{t('There are no featured products.')}</p>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;