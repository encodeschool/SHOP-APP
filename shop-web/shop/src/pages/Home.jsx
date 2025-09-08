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
import CategoryBar from '../components/CategoryBar'; // Update the import

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [brands, setBrands] = useState([]);
  const { t, i18n } = useTranslation();
  const brandPrevRef = useRef(null);
  const brandNextRef = useRef(null);
  const featuredPrevRef = useRef(null);
  const featuredNextRef = useRef(null);
  const { setLoading } = useLoading();
  const dispatch = useDispatch();
  const BASE_URL = process.env.REACT_APP_BASE_URL || '';

  // Get localized name from translations or fallback to default name
  const getLocalizedName = (item) => {
    if (!item) return '';
    const lang = i18n.language === 'lv' ? 'en' : i18n.language;
    const translation = item.translations?.find(t => t.language === lang);
    return translation?.name || item.name || 'Unnamed';
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const lang = i18n.language === 'lv' ? 'en' : i18n.language;
        const res = await axios.get(`/products/lang?lang=${lang}`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [i18n.language, setLoading]);

  useEffect(() => {
    setLoading(true);
    const fetchBrands = async () => {
      try {
        const res = await axios.get('/products/brands');
        setBrands(res.data);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
        setBrands([]);
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
        const lang = i18n.language === 'lv' ? 'en' : i18n.language;
        const res = await axios.get(`/categories?lang=${lang}`);
        const uniqueCategories = [];
        const seenIds = new Set();
        res.data.forEach((cat) => {
          if (!seenIds.has(cat.id)) {
            seenIds.add(cat.id);
            uniqueCategories.push(cat);
          } else {
            console.warn(`Duplicate category ID detected: ${cat.id}, Name=${cat.name}`);
          }
        });
        const rootCategories = uniqueCategories.filter(
          (cat) => cat.parentId === null && cat.subcategories && cat.subcategories.length > 0
        );
        rootCategories.forEach((cat) => {
          const uniqueSubcategories = [];
          const subSeenIds = new Set();
          cat.subcategories.forEach((sub) => {
            if (!subSeenIds.has(sub.id)) {
              subSeenIds.add(sub.id);
              uniqueSubcategories.push(sub);
            } else {
              console.warn(`Duplicate subcategory ID detected: ${sub.id}, Name=${sub.name}, ParentID=${cat.id}`);
            }
          });
          cat.subcategories = uniqueSubcategories;
        });
        setCategories(rootCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [i18n.language, setLoading]);

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
          setFavorites([]);
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
      <CarouselBanner />
      <FeatureStrip />
      <div className="container mx-auto px-4 py-6">
        <h1 className="w-fit border-b-[4px] border-indigo-400 text-xl">{t('All Products')}</h1>
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <Link
              to={`/product/${product.id}`}
              key={`${product.id}-${index}`}
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
          className="pb-10"
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 6 },
          }}
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={`${brand.id}-${index}`}>
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
              .map((product, index) => (
                <SwiperSlide key={`${product.id}-${index}`}>
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