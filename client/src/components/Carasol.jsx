import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import w from "../image/w.jpg";
import r from "../image/r.png";
import v from "../image/v.jpg";

const Carasol = ({ category }) => {
  let slides = [];

  if (category === "khadar") {
    slides = [
      "https://hub.wtm.com/wp-content/uploads/2018/08/Blogging.jpg",
      "https://image/cc1.webp",
      "https://cdn.shopify.com/s/files/1/0248/7892/t/52/assets/hamilton-watches-banner_1440x.jpg",
      "https://i.pinimg.com/originals/4f/7f/83/4f7f83f20552d1055c2f7f4a3d84b6bf.jpg",
    ];
  } else if (category === "valvet") {
    slides = [
      "https://hub.wtm.com/wp-content/uploads/2018/08/Blogging.jpg",
      "https://image/cc1.webp",
      "https://cdn.shopify.com/s/files/1/0248/7892/t/52/assets/hamilton-watches-banner_1440x.jpg",
      "https://i.pinimg.com/originals/4f/7f/83/4f7f83f20552d1055c2f7f4a3d84b6bf.jpg",
    ];
  } else {
    slides = [
      v,
      r,
      w,

      //"https://www.mariab.pk/cdn/shop/files/Luxury_Pret_Web_Banner_02.jpg?v=1763444782",
    ];
  }

  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [
      AutoScroll({
        speed: 2,
        startDelay: 100,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  return (
    <div className="embla overflow-hidden w-full" ref={emblaRef}>
      <div className="embla__container flex">
        {slides.map((img, i) => (
          <div
            className="embla__slide flex-[0_0_100%] min-w-0"
            key={i}
          >
            <img
              src={img}
              className="w-full h-[180px] xs:h-[220px] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-xl select-none"
              alt=""
              draggable="false"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carasol;
