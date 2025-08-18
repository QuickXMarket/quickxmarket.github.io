import React from "react";
import ProductCard from "./ProductCard";
import { useCoreContext } from "../context/CoreContext";
import { useProductContext } from "../context/ProductContext";

const BestSeller = () => {
  const { axios } = useCoreContext();
  const { products } = useProductContext();

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Featured Products</p>
      <div className="grid grid-cols-2 min-[460px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-6 lg:grid-cols-6 mt-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 6)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
