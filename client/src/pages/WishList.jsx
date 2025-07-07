import React from "react";
import { useAppContext } from "../context/AppContext";
import WishListCard from "../components/WishListCard";

const WishList = () => {
  const { wishList, products } = useAppContext();

  const wishListProducts = products.filter((p) => wishList.includes(p._id));

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">Wish List</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {wishListProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {wishListProducts.map((product) => (
            <WishListCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-16 text-center">
          Your wishlist is empty.
        </p>
      )}
    </div>
  );
};

export default WishList;
