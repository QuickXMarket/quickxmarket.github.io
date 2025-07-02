import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  const slidesData = [
    {
      large: assets.first_banner_image,
      small: assets.first_banner_image,
      color: "white",
      buttonText: "Explore Products",
      buttonLink: "/products",
      bannerText: "Experience the art of easy shopping!",
    },
    {
      large: assets.second_banner_image,
      small: assets.second_banner_image,
      color: "#2f855a",
      buttonText: "Visit Shops",
      buttonLink: "/shops",
      bannerText: "From browsing to checkout, simplicity in every step.",
    },
  ];

  const [slides, setSlides] = useState([slidesData[0], slidesData[1]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (animating) return;
      setAnimating(true);

      if (containerRef.current) {
        containerRef.current.style.transition = "transform 1s linear";
        containerRef.current.style.transform = "translateX(-50%)";
      }

      setTimeout(() => {
        setSlides((prevSlides) => {
          const nextIndex = (currentIndex + 2) % slidesData.length;
          const newSlides = [...prevSlides.slice(1), slidesData[nextIndex]];
          return newSlides;
        });
        setCurrentIndex((prev) => (prev + 1) % slidesData.length);

        if (containerRef.current) {
          containerRef.current.style.transition = "none";
          containerRef.current.style.transform = "translateX(0)";
        }
        setAnimating(false);
      }, 1000);
    }, 6000);

    return () => clearInterval(interval);
  }, [animating, currentIndex, slidesData]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex"
        style={{ width: `${slides.length * 100}%` }}
        ref={containerRef}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            <img
              src={slide.large}
              alt={`banner large ${idx}`}
              className="hidden md:block w-full h-full object-cover"
            />
            <img
              src={slide.small}
              alt={`banner small ${idx}`}
              className="md:hidden w-full h-[400px] object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 transition-colors duration-500"
          style={{ color: slides[0].color }}
        >
          {slides[0].bannerText}{" "}
        </h1>

        <div className="flex items-center mt-6 font-medium md:mt-12 ">
          <Link
            to={slides[0].buttonLink}
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer"
          >
            {slides[0].buttonText}
            <img
              className="md:hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
