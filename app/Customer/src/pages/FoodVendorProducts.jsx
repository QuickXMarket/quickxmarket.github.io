import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProductContext } from "../context/ProductContext";
import { useCoreContext } from "../context/CoreContext";

const FoodVendorProducts = () => {
  const { products } = useProductContext();
  const { makeRequest } = useCoreContext();
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);

  const filteredProducts = products.filter(
    (product) =>
      product.vendorId === vendorId && product.category.toLowerCase() === "food"
  );

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await makeRequest({
          method: "GET",
          url: `/api/seller/vendor/${vendorId}`,
        });
        if (data.success) {
          setVendor(data.vendor);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch vendor details.");
      }
    };
    fetchVendor();
  }, [vendorId, makeRequest]);

  return (
    <div className="mt-16">
      {vendor && vendor.businessName && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {vendor.businessName.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">
            No products found for this Vendor.
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodVendorProducts;
