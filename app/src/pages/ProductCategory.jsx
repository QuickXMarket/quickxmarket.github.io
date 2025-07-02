import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import VendorCard from "../components/VendorCard";

const ProductCategory = () => {
  const { products, makeRequest } = useAppContext();
  const { category } = useParams();

  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );

  useEffect(() => {
    const fetchVendors = async () => {
      if (category === "food") {
        setLoadingVendors(true);
        try {
          const uniqueVendorIds = [
            ...new Set(filteredProducts.map((product) => product.vendorId)),
          ];
          const vendorsData = [];
          for (const vendorId of uniqueVendorIds) {
            const data = await makeRequest({ method: "GET", url: `/api/seller/vendor/${vendorId}` });
            if (!data.success) continue;
            vendorsData.push(data.vendor);
          }
          setVendors(vendorsData);
        } catch (error) {
          console.error("Error fetching vendors:", error);
          setVendors([]);
        } finally {
          setLoadingVendors(false);
        }
      }
    };
    fetchVendors();
  }, [category, products]);

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}
      {category === "food" ? (
        loadingVendors ? (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-2xl font-medium text-primary">
              Loading vendors...
            </p>
          </div>
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor._id}
                vendor={vendor}
                link={`/products/food/${vendor._id}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-2xl font-medium text-primary">
              No vendors found.
            </p>
          </div>
        )
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
