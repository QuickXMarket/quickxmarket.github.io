import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products, axios } = useAppContext();
  // const sendMessage = async () => {
  //   try {
  //     const { data } = await axios.post("/api/sms/send", {
  //       to: "+2348140338531", // Replace with the recipient's phone number
  //       message: "Hello from QuickXMarket!",
  //     });
  //     if (data.success) {
  //       console.log(data.message);
  //     } else {
  //       console.log(data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
