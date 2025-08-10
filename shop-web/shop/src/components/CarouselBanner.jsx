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
          "https://www.rdveikals.lv/images/banners/c299249fdec2791591e037fb672ab263.jpg",
          "https://www.rdveikals.lv/images/banners/36a3d9c245419040ca4ea681e36ec3ae.jpg",
          "https://www.rdveikals.lv/images/banners/36a3d9c245419040ca4ea681e36ec3ae.jpg"
        ].map((url, index) => (
          <div
            key={index}
            className="h-[300px] md:h-[450px] bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${url})` }}
          ></div>
        ))}
      </Carousel>
    </div>
  );
}
