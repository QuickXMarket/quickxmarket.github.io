import React from "react";
import { Link } from "react-router-dom";

const VendorCard = ({ vendor }) => {
  return (
    <Link to={`/products/food/${vendor._id}`}>
      <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition">
        {vendor.profilePhoto ? (
          <img
            className="w-full h-[200px] object-cover"
            src={vendor.profilePhoto}
            alt={vendor.businessName}
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <div className="p-3 text-gray-800 font-semibold text-lg truncate">
          {vendor.businessName}
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;
