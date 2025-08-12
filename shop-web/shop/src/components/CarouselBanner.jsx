import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function CarouselBanner() {
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
        {[
          "https://cdn.4games.pro/storage/upload-b/2025/07/1920x422%20Eng.png?v=1751640058",
          "https://cdn.4games.pro/storage/upload-b/2025/03/1920x422%20-%20RK.png?v=1751639832",
          "https://cdn.4games.pro/storage/upload-b/2025/02/1920x422%20cases.jpg?v=1747587507"
        ].map((url, index) => (
          <div
            key={index}
            className="h-[300px] md:h-[300px] bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${url})` }}
          ></div>
        ))}
      </Carousel>
    </div>
  );
}
