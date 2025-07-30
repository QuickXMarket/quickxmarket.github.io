import React from "react";
import { Link } from "react-router-dom";
import WishlistIcon from "../assets/heart-fill.svg?react";
import { useProductContext } from "../context/ProductContext";
import { useCoreContext } from "../context/CoreContext";

const WishListCard = ({ product }) => {
  const { currency } = useCoreContext();
  const { addToCart, updateWishList } = useProductContext();

  return (
    <div className="flex items-center gap-4 border-b py-3 px-2">
      <Link to={`/products/${product.category.toLowerCase()}/${product._id}`}>
        <img
          src={product.image[0]}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      </Link>

      <div className="flex flex-col justify-between flex-grow text-sm">
        <div className="font-medium text-gray-800 line-clamp-2 max-w-[75%]">
          {product.name}
        </div>

        <div className="mt-1 text-primary font-semibold text-base">
          {currency}
          {product.offerPrice}
          <span className="ml-2 text-gray-500 line-through font-normal text-sm">
            {currency}
            {product.price}
          </span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => addToCart(product._id)}
            className="text-center text-white bg-primary hover:bg-primary-dull px-3 py-1 rounded text-sm"
          >
            Add to Cart
          </button>
          <WishlistIcon
            className="w-5 h-5 cursor-pointer text-primary"
            onClick={() => updateWishList(product._id)}
          />
        </div>
      </div>
    </div>
  );
};

export default WishListCard;
