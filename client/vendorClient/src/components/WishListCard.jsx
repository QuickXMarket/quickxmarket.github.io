import React from "react";
import { Link } from "react-router-dom";
import WishlistIcon from "../assets/heart-fill.svg?react";
import { useProductContext } from "../context/ProductContext";
import { useCoreContext } from "../context/CoreContext";

const WishListCard = ({ product }) => {
  const { currency } = useCoreContext();
  const { addToCart, updateWishList } = useProductContext();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 border rounded-md border-gray-200 p-3 shadow-sm hover:shadow transition">
      <Link
        to={`/products/${product.category.toLowerCase()}/${product._id}`}
        className="shrink-0"
      >
        <img
          src={product.image[0]}
          alt={product.name}
          className="w-28 h-28 object-cover rounded-md"
        />
      </Link>

      <div className="flex flex-col justify-between flex-grow text-sm w-full">
        <div className="flex justify-between items-start gap-2">
          <div className="font-medium text-gray-800 line-clamp-2 text-base">
            {product.name}
          </div>
          <WishlistIcon
            className="w-5 h-5 cursor-pointer text-primary shrink-0"
            onClick={() => updateWishList(product._id)}
          />
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
          className="mt-3 text-center text-white bg-primary hover:bg-primary-dull px-4 py-2 rounded text-sm w-fit"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default WishListCard;
