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
    },
    {
      large: assets.second_banner_image,
      small: assets.second_banner_image,
      color: "#2f855a",
      buttonText: "Shop Now",
      buttonLink: "/shop",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const startXRef = useRef(null);
  const isDraggingRef = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slidesData.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      startXRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (startXRef.current === null) return;
      const diffX = e.touches[0].clientX - startXRef.current;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentSlide > 0) {
          setCurrentSlide((prev) => prev - 1);
        } else if (diffX < 0 && currentSlide < slidesData.length - 1) {
          setCurrentSlide((prev) => prev + 1);
        }
        startXRef.current = null;
      }
    };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || startXRef.current === null) return;

      const diffX = e.clientX - startXRef.current;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentSlide > 0) {
          setCurrentSlide((prev) => prev - 1);
        } else if (diffX < 0 && currentSlide < slidesData.length - 1) {
          setCurrentSlide((prev) => prev + 1);
        }
        startXRef.current = null;
        isDraggingRef.current = false;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      startXRef.current = null;
    };

    // Touch events
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);

    // Mouse events
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [currentSlide, slidesData.length]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden relative w-full cursor-grab"
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-[300px] sm:h-[400px] md:h-[500px] relative"
          >
            <img
              src={slide.large}
              alt="slide"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-4"
                style={{ color: slide.color }}
              >
                Experience the art of easy shopping!
              </h2>
              <Link
                to={slide.buttonLink}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm sm:text-base"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default MainBanner;
