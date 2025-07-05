import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const WishListCard = ({ product }) => {
  const { currency, addToCart, updateWishList } = useAppContext();

  return (
    <div className="flex items-center gap-4 border-b py-3 px-2">
      <img
        src={product.image[0]}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-md"
      />

      <div className="flex flex-col justify-between flex-grow text-sm">
        <div className="flex justify-between items-start">
          <div className="font-medium text-gray-800 line-clamp-2 max-w-[75%]">
            {product.name}
          </div>
          <button
            onClick={() => updateWishList(product._id)}
            className="text-red-500 hover:text-red-600 text-lg ml-2"
          >
            ✕
          </button>
        </div>

        <div className="mt-1 text-primary font-semibold text-base">
          {currency}
          {product.offerPrice}
          <span className="ml-2 text-gray-500 line-through font-normal text-sm">
            {currency}
            {product.price}
          </span>
        </div>

        <button
          onClick={() => addToCart(product._id)}
          className="mt-2 text-center text-white bg-primary hover:bg-primary-dull px-3 py-1 rounded text-sm w-fit"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default WishListCard;
