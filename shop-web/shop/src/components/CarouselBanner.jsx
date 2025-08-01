import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import CSS
import { Carousel } from "react-responsive-carousel";

export default function CarouselBanner() {
  return (
    <div>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        className="rounded-lg shadow"
      >
        <div>
          <img src="https://cdn.4games.pro/storage/upload-b/2025/06/1920x422-canyon.png?v=1751639846" alt="Banner 1" />
        </div>
        <div>
          <img src="https://cdn.4games.pro/storage/upload-b/2025/06/1920x422-canyon.png?v=1751639846" alt="Banner 2" />
        </div>
        <div>
          <img src="https://cdn.4games.pro/storage/upload-b/2025/06/1920x422-canyon.png?v=1751639846" alt="Banner 3" />
        </div>
      </Carousel>
    </div>
  );
}
