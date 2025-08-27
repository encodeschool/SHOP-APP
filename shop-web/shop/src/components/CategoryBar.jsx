import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CategoryCarousel = ({ categories, getLocalizedName, BASE_URL, handleCategoryClick, hoveredCategory, setHoveredCategory, hoveredSubcategory, setHoveredSubcategory, setSelectedSubImage }) => {
  const categoryPrevRef = useRef(null);
  const categoryNextRef = useRef(null);

  return (
    <div className="w-full bg-indigo-400 relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          <div className="flex gap-2">
            <button
              ref={categoryPrevRef}
              className="swiper-button-prev-custom absolute bg-white left-0 p-[1px] px-[9px] text-indigo-400 font-bold rounded z-50"
            >
              ❮
            </button>
            <button
              ref={categoryNextRef}
              className="swiper-button-next-custom absolute right-0 bg-white p-[1px] px-[9px] text-indigo-400 font-bold rounded z-50"
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
            prevEl: categoryPrevRef.current,
            nextEl: categoryNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = categoryPrevRef.current;
            swiper.params.navigation.nextEl = categoryNextRef.current;
          }}
          className="category-swiper"
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          style={{ overflow: 'visible' }}
          onTouchMove={(swiper, event) => {
            event.stopPropagation();
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide
              key={`${category.id}-${index}`}
              className="relative"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex items-center text-white text-base font-medium px-2">
                <img
                  src={
                    category.icon
                      ? `${BASE_URL}${category.icon}`
                      : '/placeholder.jpg'
                  }
                  alt={getLocalizedName(category)}
                  className="w-[20px] invert-[100%] mr-2 object-contain"
                />
                <button className="hover:underline">{getLocalizedName(category)}</button>
              </div>
              {/* Mega Menu Dropdown */}
              {hoveredCategory?.id === category.id && (
                <div className="absolute top-full left-0 bg-white text-black shadow-lg z-[100] flex p-6 mt-1 rounded w-auto max-w-[calc(100vw-2rem)]">
                  <div className="grid gap-4 w-auto flex-1">
                    {category.subcategories?.map((sub, subIndex) => (
                      <div
                        key={`${sub.id}-${subIndex}`}
                        className="relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHoveredSubcategory(hoveredSubcategory?.id === sub.id ? null : sub);
                          setSelectedSubImage(sub.imageUrl);
                        }}
                      >
                        <Link
                          to={`/category/${sub.id}`}
                          className="hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {getLocalizedName(sub)}
                        </Link>
                        {hoveredSubcategory?.id === sub.id && sub.subcategories?.length > 0 && (
                          <div className="absolute left-full top-0 bg-white text-black shadow-lg p-4 rounded ml-2 w-fit z-[100]">
                            {sub.subcategories.map((subsub, subsubIndex) => (
                              <Link
                                key={`${subsub.id}-${subsubIndex}`}
                                to={`/category/${subsub.id}`}
                                className="block hover:underline py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {getLocalizedName(subsub)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {hoveredSubcategory?.imageUrl && (
                    <div className="ml-4">
                      <img
                        src={`${BASE_URL}${hoveredSubcategory.imageUrl}`}
                        alt="Subcategory"
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryCarousel;