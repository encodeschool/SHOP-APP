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
        className=""
      >
        <div>
          <img src="https://www.rdveikals.lv/images/banners/c299249fdec2791591e037fb672ab263.jpg" alt="Banner 1" />
        </div>
        <div>
          <img src="https://www.rdveikals.lv/images/banners/36a3d9c245419040ca4ea681e36ec3ae.jpg" alt="Banner 2" />
        </div>
        <div>
          <img src="https://www.rdveikals.lv/images/banners/dda34b3f9d0aba7a6d0ca662c2abc498.jpg" alt="Banner 3" />
        </div>
      </Carousel>
    </div>
  );
}
