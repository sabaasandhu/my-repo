import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

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
      "https://styka.pk/cdn/shop/files/Styka-01.webp?v=1764914779&width=1370",
      "https://styka.pk/cdn/shop/files/Styka-03.webp?v=1764914779&width=1370",
      "https://www.mariab.pk/cdn/shop/files/Luxury_Pret_Web_Banner_02.jpg?v=1763444782",
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
    <div className="embla overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex">
        {slides.map((img, i) => (
          <div className="embla__slide min-w-full" key={i}>
            <img
              src={img}
              className="w-full h-[250px] md:h-[450px] object-cover rounded-xl"
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carasol;
