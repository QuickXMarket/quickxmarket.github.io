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
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${productId}`);
        scrollTo(0, 0);
      }}
      className="border border-gray-500/20 rounded-md max-w-54 md:px-4 px-3 py-2"
    >
      <div className="group cursor-pointer flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition max-w-26 md:max-w-36 h-26"
          src={product.image[0]}
          alt={product.name}
        />
      </div>
      <div className="text-gray-500/60 text-sm">
        <p className="truncate">{product.category}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">
          {product.name}
        </p>
        <div className="flex items-center gap-0.5">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="md:w-3.5 w-3"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
              />
            ))}
          <p>(4)</p>
        </div>
        <div className="flex flex-wrap items-end justify-end mt-3">
          <p className="md:text-xl text-base font-medium text-primary">
            {currency}
            {defaultOption.offerPrice || defaultOption.price}{" "}
            <span className="text-gray-500/60 md:text-sm text-xs line-through">
              {currency}
              {defaultOption.price}
            </span>
          </p>
          {product.options.length === 1 && (
            <div onClick={(e) => e.stopPropagation()} className="text-primary">
              {quantity === 0 ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer"
                  onClick={() => addToCart(productId, optionId)}
                >
                  <img src={assets.cart_icon} alt="cart_icon" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
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
      </div>
    </div>
  );
};

export default ProductCard;
