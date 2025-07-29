import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const BottomBanner = () => {
  const slideshowImages = [
    assets.Slideshow_1,
    assets.Slideshow_2,
    assets.Slideshow_3,
    assets.Slideshow_4,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); 
    return () => clearInterval(intervalId);
  }, [slideshowImages.length]);

  return (
    <div className="relative mt-24 w-full h-64 overflow-hidden">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slideshowImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slideshow ${index + 1}`}
            className="w-full flex-shrink-0 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default BottomBanner;
