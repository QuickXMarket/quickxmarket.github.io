import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";

const Navbar = ({ businessName }) => {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
      <Link to="/">
        <img
          src={assets.QuickXMarket_Logo_Transparent}
          alt="log"
          className="cursor-pointer w-34 md:w-38"
        />
      </Link>
      <div className="flex items-center gap-5 text-gray-500">
        <p className="truncate w-20 sm:w-full">Hi! {businessName}</p>

        {/* <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button> */}
      </div>
    </div>
  );
};

export default Navbar;
