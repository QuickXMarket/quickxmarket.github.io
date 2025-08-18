import React from "react";
import { categories } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";

const Categories = () => {
  const { navigate } = useCoreContext();

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Categories</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-2">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-108 transition max-w-20 h-20 "
            />
            <p className="text-sm font-medium truncate w-full">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
