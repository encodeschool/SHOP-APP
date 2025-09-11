// src/components/CategorySection.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FaStar, FaRecycle, FaCartPlus, FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";
import CompareButton from "./CompareButton";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useTranslation } from "react-i18next";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CategorySection = ({ title, icon: Icon, products, categoryId, BASE_URL, favorites, setFavorites }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // filter products by categoryId
  const filteredProducts = products.filter((p) => p.categoryId === categoryId);

  return (
    <div className="pinkish py-10 mt-10">
      <div className="container mx-auto px-4 md:px-10 py-6">
        {/* Title */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex gap-2 items-center">
            <button
              ref={prevRef}
              className="swiper-button-prev-custom text-red-500 p-2 px-4 rounded-full hover:text-red-500 hover:cursor-pointer"
            >
              <FaLongArrowAltLeft />
            </button>
            <h1 className="text-center font-[100] text-3xl uppercase flex justify-center items-center">
              {Icon && <Icon size={50} className="mr-3" />} {title}
            </h1>
            <button
              ref={nextRef}
              className="swiper-button-next-custom text-red-500 p-2 px-4 rounded-full hover:text-red-500 hover:cursor-pointer"
            >
              <FaLongArrowAltRight />
            </button>
          </div>
        </div>

        {/* "See all" link */}
        <div className="mb-14 flex justify-center items-center">
          <Link
            to={`/filtered?category=${categoryId}`}
            className="text-sm text-red-600 underline hover:text-red-800 transition delay-150"
          >
            See all
          </Link>
        </div>

        {/* Slider */}
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
          className="pb-10"
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  className="relative border p-4 bg-white rounded-xl hover:shadow group h-full block"
                >
                  <p className="absolute top-0 px-3 py-1 flex items-center justify-center left-0 z-10 bg-gray-100 text-red-600 rounded-tl-xl">
                    {product.condition === "NEW" ? (
                      <>
                        <FaStar className="inline mr-1" /> {t("NEW")}
                      </>
                    ) : (
                      <>
                        <FaRecycle className="inline mr-1" /> {t("USED")}
                      </>
                    )}
                  </p>

                  {/* Favorite button */}
                  <FavoriteButton productId={product.id} favorites={favorites} setFavorites={setFavorites} />

                  <img
                    src={product.imageUrls?.[0] ? `${BASE_URL}${product.imageUrls[0]}` : "/placeholder.jpg"}
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
              <p className="text-center w-full">{t("There are no products in this category.")}</p>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySection;
