import React from "react";
import { useAppContext } from "../context/AppContext";
import WishListCard from "../components/WishListCard"; 

const WishList = () => {
  const { wishList, products } = useAppContext();

  const wishListProducts = products.filter((p) => wishList.includes(p._id));

  return (
    <div className="pt-4 px-4 pb-24">
      <h2 className="text-xl font-semibold mb-4">Your Wishlist</h2>

      {wishListProducts.length > 0 ? (
        <div className="flex flex-col gap-3">
          {wishListProducts.map((product) => (
            <WishListCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-12 text-center">
          Your wishlist is empty.
        </p>
      )}
    </div>
  );
};

export default WishList;
