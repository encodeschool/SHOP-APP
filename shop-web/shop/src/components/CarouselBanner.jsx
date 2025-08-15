import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import axios from "../api/axios"; // your centralized axios instance

export default function CarouselBanner() {
  const [banners, setBanners] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Fetch banners from backend
  const fetchBanners = async () => {
    try {
      const { data } = await axios.get("/banner");
      setBanners(data);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (!banners.length) return null; // optionally show a loader

  return (
    <div className="w-full">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        className="w-full"
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
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
                  className="bg-indigo-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-indigo-600 text-white transition"
                >
                  {banner.buttonText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
