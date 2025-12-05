import React, { useEffect, useState } from "react";
import "swiper/css"; // core Swiper styles
import "swiper/css/navigation"; // navigation module styles
import "swiper/css/pagination"; // pagination module styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';

export default function CarouselBanner() {
  const [banners, setBanners] = useState([]);
  const { i18n } = useTranslation();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Fetch banners from backend
  const fetchBanners = async () => {
    try {
      const lang = i18n.language === 'lv' ? 'en' : i18n.language; // fallback
      const { data } = await axios.get(`/banner/lang?lang=${lang}`);
      setBanners(data);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [i18n.language]); // lang o‘zgarganda qayta fetch qilinadi

  if (!banners.length) return null;

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className="relative h-[450px] md:h-[450px] bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(${BASE_URL}${banner.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-6 md:p-16">
                <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                  {banner.title}
                </h2>
                <p className="text-white text-base md:text-lg mb-4 drop-shadow-md">
                  {banner.description}
                </p>
                {banner.buttonLink && banner.buttonText && (
                  <Link
                    to={banner.buttonLink}
                    className="bg-red-600 text-black px-4 py-2 rounded-lg font-medium hover:bg-red-800 text-white transition"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}