import React from "react";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";
import { useProductContext } from "../context/ProductContext";

const ProductCard = ({ product }) => {
  const { currency, navigate } = useCoreContext();
  const { addToCart, removeFromCart, cartItems } = useProductContext();

  // Assume default display option is the first one
  const defaultOption = product.options?.[0];
  if (!defaultOption) return null;

  const productId = product._id;
  const optionId = defaultOption._id;
  const quantity = cartItems[productId]?.[optionId] || 0;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden group max-w-[150px]"
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${productId}`);
        scrollTo(0, 0);
      }}
    >
      <div className="relative">
        <img
          alt={product.name}
          className="w-full h-28 object-cover"
          src={product.image[0]}
        />
        <div className="flex items-center justify-end w-full mt-2 absolute bottom-2">
          <div className="flex text-yellow-400">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="md:w-5 w-5"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
          </div>
        </div>
      </div>
      <div className="py-2 px-2 flex flex-col flex-grow">
        <h3 className="text-base font-medium text-gray-800 mt-1 truncate">
          {product.name}
        </h3>
        <div className="flex items-baseline mt- flex-wrap">
          {defaultOption.offerPrice && (
            <span className="text-base font-semibold text-gray-900">
              {currency}
              {defaultOption.offerPrice}
            </span>
          )}
          <span className="text-sm text-gray-500 line-through ml-2">
            {currency}
            {defaultOption.price}
          </span>
        </div>
      </div>
      {product.options.length === 1 && (
        <div className="  w-full" onClick={(e) => e.stopPropagation()}>
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(productId, optionId)}
              className="w-full bg-primary text-white py-2 px-4 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-dull transition-colors"
            >
              {/* <img src={assets.cart_icon} alt="cart_icon" /> */}
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-around gap-2  w-full h-[34px] bg-primary/25 rounded select-none">
              <button
                onClick={() => removeFromCart(productId, optionId)}
                className="cursor-pointer text-md px-2 h-full"
              >
                -
              </button>
              <span className="w-5 text-center">{quantity}</span>
              <button
                onClick={() => addToCart(productId, optionId)}
                className="cursor-pointer text-md px-2 h-full"
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
