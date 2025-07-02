import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import VendorCard from "../components/VendorCard";

const ShopList = () => {
  const { makeRequest } = useAppContext();

  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      try {
        const  data  = await makeRequest({
          url: `/api/seller/list`,
          method: "GET",
        });

        setVendors(data.vendors || []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="mt-16">
      {loadingVendors ? (
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
              link={`/shops/${vendor._id}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">No vendors found.</p>
        </div>
      )}
    </div>
  );
};

export default ShopList;
