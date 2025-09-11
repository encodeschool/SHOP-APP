import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import CarouselBanner from '../components/CarouselBanner';
import { FaCartPlus, FaHeart, FaStar, FaRecycle, FaCalendarAlt, FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
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
import CategoryBar from '../components/CategoryBar';
import { MdOutlineMenuBook, MdOutlineWorkspacePremium } from 'react-icons/md';
import { GrValidate } from 'react-icons/gr';
import { TbTruckDelivery } from 'react-icons/tb';
import { GiCow } from 'react-icons/gi';
import CategorySection from '../components/CategorySection';
import { GiRoastChicken,GiRabbit  } from "react-icons/gi";
import { LuBeef } from "react-icons/lu";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState(8); // Add state for products to show
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

  const handleExpand = () => {
    setProductsToShow(prev => prev + 6);
  };

  const beefSubcategory = categories
    .flatMap((cat) => cat.subcategories || [])
    .find((sub) => getLocalizedName(sub).toLowerCase().includes("beef"));

  const chickenSubcategory = categories
    .flatMap((cat) => cat.subcategories || [])
    .find((sub) => getLocalizedName(sub).toLowerCase().includes("chicken"));

  const rabbitSubcategory = categories
    .flatMap((cat) => cat.subcategories || [])
    .find((sub) => getLocalizedName(sub).toLowerCase().includes("rabbit"));

  const marbledBeef = categories
    .flatMap((cat) => cat.subcategories || [])
    .find((sub) => getLocalizedName(sub).toLowerCase().includes("Marbled beef"));

  return (
    <div>
      <CarouselBanner />
      {/* <FeatureStrip /> */}

      {/* The most popular meats Section Goes Here */}
      <div className='pinkish py-10'>
        <div className="container mx-auto px-4 md:px-10 py-6">
          <div className="flex justify-center mb-4 text-yellow-400">
            <FaStar className='mx-1' size={25} />
            <FaStar className='mx-1' size={25} />
            <FaStar className='mx-1' size={25} />
            <FaStar className='mx-1' size={25} />
            <FaStar className='mx-1' size={25} />
          </div>
          <h1 className="mb-4 text-center font-[100] text-3xl uppercase">Popular Meat Products</h1>
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, productsToShow).map((product, index) => (
              <Link
                to={`/product/${product.id}`}
                key={`${product.id}-${index}`}
                className="relative border p-4 bg-white rounded-xl hover:shadow group"
              >
                <p
                  className={`absolute top-0 px-3 flex items-center justify-center py-1 left-0 z-10 bg-gray-100 text-red-600 rounded-tl-xl`}
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
                    <p className="text-red-600 text-3xl font-bold mt-2">${product.price}</p>
                    <CompareButton product={product} />
                  </div>
                  <FavoriteButton
                    productId={product.id}
                    favorites={favorites}
                    setFavorites={setFavorites}
                  />
                  <button
                    className="bg-red-600 p-3 flex items-center justify-center absolute bottom-0 right-0 rounded-br-xl h-[50px] w-[50px] text-white hover:bg-red-600"
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
          {productsToShow < products.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleExpand}
                className="text-white bg-red-600 py-2 px-6 rounded-full hover:bg-red-800 transition delay-150"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
      {/* The most popular meats Section Ends Here */}

      {/* Meal Section Goes Here */}
      <div className='container mx-auto px-4 md:px-10 py-3'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 py-10">
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 md:col-span-2 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/100/rkcgt2qjs04d6hft2ryxqaw4tvfenzmf/midi_uzhin.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              For Home Supper
            </p>
          </Link>
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px]" style={{backgroundImage: "url(https://primemeat.ru/upload/webp/iblock/3ca/fs4l14f2mwzdiy0datcbsr3bcy5kwoij/banner_360kh360_shashlyk_new.webp)"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              For Shashlik
            </p>
          </Link>
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/f71/42ili6yme5omfvd7xagaei11c46rk3ph/banner_360kh360_kotlety_new.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              For Burgers
            </p>
          </Link>
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/ed7/l9p288v02doy0y7nppl6zhjndil3tn0o/kolbaski.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              Sausages
            </p>
          </Link>
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/560/ijvhpcbgsk23pabzooybqgyd2h2g5lr6/banner_360kh360_kulinaria.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              Cooking
            </p>
          </Link>
        </div>
      </div>
      {/* Meal Section Ends Here */}

      {/* Ideas for a week Section Goes Here */}
      <div className=''>
        <div className="container mx-auto px-4 md:px-10 py-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex gap-2 items-center">
              <button
                ref={featuredPrevRef}
                className="swiper-button-prev-custom text-red-500 p-2 px-4 rounded-full hover:text-red-500 hover:cursor-pointer"
              >
                <FaLongArrowAltLeft />
              </button>
              <h1 className="text-center font-[100] text-3xl uppercase flex justify-center items-center"><FaCalendarAlt className='mr-3' />Ideas for a week</h1>
              <button
                ref={featuredNextRef}
                className="swiper-button-next-custom text-red-500 p-2 px-4 rounded-full hover:text-red-500 hover:cursor-pointer"
              >
                <FaLongArrowAltRight />
              </button>
            </div>
          </div>
          <div className="mb-14 flex justify-center items-center">
            <Link to='/filtered' className='text-sm text-red-600 underline hover:text-red-800 transition delay-150'>See all</Link>
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
                        className="absolute top-0 px-3 py-1 flex items-center justify-center left-0 z-10 bg-gray-100 text-red-600 rounded-tl-xl"
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
                          <p className="text-red-600 text-3xl font-bold mt-2">${product.price}</p>
                          <CompareButton product={product} />
                        </div>
                        <button
                          className="bg-red-600 p-3 flex items-center justify-center absolute bottom-0 right-0 rounded-br-xl h-[50px] w-[50px] text-white hover:bg-red-600"
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
      {/* Ideas for a week Section Ends Here */}

      {/* Beef for a week Section Goes Here */}
      {beefSubcategory && (
        <CategorySection
          title="Beef Meats"
          icon={GiCow}
          products={products}
          categoryId={beefSubcategory.id}
          BASE_URL={BASE_URL}
          favorites={favorites}
          setFavorites={setFavorites}
          bgcolor="pinkish"
        />
      )}
      {/* Beef for a week Section Ends Here */}

      {/* <div className="container mx-auto px-4 md:px-10 py-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="border-b-[4px] border-red-600 text-xl">{t('Our Brands')}</h1>
          <div className="flex gap-2">
            <button
              ref={brandPrevRef}
              className="swiper-button-prev-custom bg-red-600 p-2 px-4 text-white rounded-full hover:bg-red-600 hover:cursor-pointer"
            >
              ❮
            </button>
            <button
              ref={brandNextRef}
              className="swiper-button-next-custom bg-red-600 p-2 px-4 text-white rounded-full hover:bg-red-600 hover:cursor-pointer"
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
                <div className="p-[50px] w-full h-[150px] border-[3px] border-red-600 rounded-xl hover:shadow">
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

      <div className="container mx-auto px-4 md:px-10 py-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="border-b-[4px] border-red-600 text-xl">{t('Featured Products')}</h1>
          <div className="flex gap-2">
            <button
              ref={featuredPrevRef}
              className="swiper-button-prev-custom bg-red-600 p-2 px-4 text-white rounded-full hover:bg-red-600 hover:cursor-pointer"
            >
              ❮
            </button>
            <button
              ref={featuredNextRef}
              className="swiper-button-next-custom bg-red-600 p-2 px-4 text-white rounded-full hover:bg-red-600 hover:cursor-pointer"
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
                      className="absolute top-0 px-3 py-1 flex items-center justify-center left-0 z-10 bg-gray-100 text-red-600 rounded-tl-xl"
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
                        <p className="text-red-600 text-3xl font-bold mt-2">${product.price}</p>
                        <CompareButton product={product} />
                      </div>
                      <button
                        className="bg-red-600 p-3 flex items-center justify-center absolute bottom-0 right-0 rounded-br-xl h-[50px] w-[50px] text-white hover:bg-red-600"
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
      </div> */}

      {/* Accessories Section Goes Here */}
      <div className='container mx-auto px-4 md:px-10 py-3'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 py-10">
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center md:h-[350px] h-[300px]" style={{backgroundImage: "url(https://primemeat.ru/upload/webp/iblock/6b6/tp1awwjksxtpr9oogj8f5jgw90ovfvhj/banner_360kh360_2023_kolbasa.webp)"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              Gostronom of Meats
            </p>
          </Link>
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center md:h-[350px] h-[300px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/d28/lbc4wal6ijqvj2p7wpwje006khaalrlp/mini_pelmeni_hinkali.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              Pelmen & Hinkali
            </p>
          </Link>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10'>
            <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 md:col-span-2 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px] md:h-auto" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/ccf/category_img_8_1.webp')"}}>
              <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
                Oil & Marinads
              </p>
            </Link>
            <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px] md:h-auto" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/6fd/category_img_8_2.webp')"}}>
              <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
                Spicies
              </p>
            </Link>
            <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px] md:h-auto" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/997/category_img_8_3.webp')"}}>
              <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
                Souces
              </p>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-10">
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px] md:h-[250px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/b80/3hbrzlcvwrzup0z36gribden4pge1btw/banner_263kh263_2023_kids.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              Child menu
            </p>
          </Link>
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px] md:h-[250px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/a10/k6q33pr90byyp6nj42h2o28bkuu136uo/banner_263kh263_2023_promo.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              Promocodes
            </p>
          </Link>
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px] md:h-[250px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/c34/wssp1kposjps0t4tpchae3utrimbtn95/novinki25.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              New
            </p>
          </Link>
          <Link to='/filtered' className="text-white hover:bg-bottom transition-anim duration-300 delay-150 relative text-center rounded-lg uppercase text-2xl py-4 bg-red-600 bg-no-repeat bg-cover bg-center h-[300px] md:h-[250px]" style={{backgroundImage: "url('https://primemeat.ru/upload/webp/iblock/e5a/prz8jvpamc3jzc6rsf6pnjdehrv63jfn/banner_263kh263_2023_spice.webp')"}}>
            <p className='absolute bottom-0 left-0 right-0 primary-gradient py-4 rounded-b-lg'>
              Seasoning of primemeat
            </p>
          </Link>
        </div>
      </div>
      {/* Accessories Section Ends Here */}

      {/* Marbled beef for a week Section Goes Here */}
      {marbledBeef && (
        <CategorySection
          title="Marbled beef Meats"
          icon={LuBeef}
          products={products}
          categoryId={marbledBeef.id}
          BASE_URL={BASE_URL}
          favorites={favorites}
          setFavorites={setFavorites}
          bgcolor="bg-white"
        />
      )}
      {/* Marbled beef for a week Section Ends Here */}

      {/* Chicken for a week Section Goes Here */}
      {chickenSubcategory && (
        <CategorySection
          title="Chicken Meats"
          icon={GiRoastChicken}
          products={products}
          categoryId={chickenSubcategory.id}
          BASE_URL={BASE_URL}
          favorites={favorites}
          setFavorites={setFavorites}
          bgcolor="pinkish"
        />
      )}
      {/* Chicken for a week Section Ends Here */}

      {/* Rabbit for a week Section Goes Here */}
      {rabbitSubcategory && (
        <CategorySection
          title="Rabbit Meats"
          icon={GiRabbit}
          products={products}
          categoryId={rabbitSubcategory.id}
          BASE_URL={BASE_URL}
          favorites={favorites}
          setFavorites={setFavorites}
          bgcolor="bg-white"
        />
      )}
      {/* Rabbit for a week Section Ends Here */}

      {/* Ddelivery Section Goes Here */}
      <div className="container mx-auto px-4 md:px-10 py-10 relative">
        <h1 className="mb-14 text-center font-[100] text-3xl uppercase">Delivery to Home</h1>
        <div className="grid md:grid-cols-9 grid-cols-1 gap-4">
          <div className='flex md:justify-end justify-center md:mr-6'>
            <MdOutlineMenuBook size={75} />
          </div>
          <div className='col-span-2'>
            <h1 className='mb-3 text-red-600 text-lg'>Уникальный ассортимент</h1>
            <p className='text-sm text-gray-400'>Уже более 12 лет мы ответственно работаем вместе с несколькими тщательно отобранными фермерскими хозяйствами центральной части России и вместе производим по-настоящему лучшую мясную продукцию для наших покупателей по доступной цене.</p>
          </div>
          <div className='flex md:justify-end justify-center md:mr-6'>
            <GrValidate size={75} />
          </div>
          <div className='col-span-2'>
            <h1 className='mb-3 text-red-600 text-lg'>Гарантия качества</h1>
            <p className='text-sm text-gray-400'>Мы хотим быть уверены, в том, что вы остались довольны каждой покупкой. Если вдруг вы остались неудовлетворены товаром, просто верните его в течение 14 дней в любом виде. Мы гарантируем немедленную 100% компенсацию.</p>
          </div>
          <div className='flex md:justify-end justify-center md:mr-6'>
            <TbTruckDelivery size={75} />
          </div>
          <div className='col-span-2'>
            <h1 className='mb-3 text-red-600 text-lg'>Первоклассный сервис</h1>
            <p className='text-sm text-gray-400'>Мы доставляем свежее охлаждённое мясо по Москве, Московской области, Санкт-Петербургу и Ленинградской области ежедневно c 9.30 до 21.00 (кроме 1, 2 и 3 января). Так же Вы можете воспользоваться услугой "Экспресс-доставка в день заказа".</p>
          </div>
        </div>
      </div>      
      {/* Ddelivery Section Ends Here */}

    </div>
  );
};

export default Home;