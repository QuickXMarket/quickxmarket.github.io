import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Account = () => {
  const { user, setUser, setShowSellerLogin, navigate, makeRequest, logout } =
    useAppContext();

  return (
    <div className="max-w-xl mx-auto">
      {/* Greeting */}
      <div className=" px-4 py-6 sm:px-6 md:px-10 lg:px-16 text-center mb-6">
        <h1 className="text-2xl font-semibold">
          {user ? `Welcome, ${user.name}` : "Welcome, Guest"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {user
            ? "Manage your account settings"
            : "Sign in to access more features"}
        </p>
      </div>

      {/* Options List */}
      <div className="flex flex-col text-sm divide-y divide-gray-200">
        {/* Seller Dashboard / Register */}
        {user?.role === "vendor" ? (
          <Link
            to={"/seller"}
            className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
          >
            <span>Seller Dashboard</span>
            <img src={assets.black_arrow_icon} className="w-4" alt=">" />
          </Link>
        ) : (
          <div
            className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
            onClick={() => {
              setShowSellerLogin(true);
            }}
          >
            <span>Register as a Vendor</span>
            <img src={assets.black_arrow_icon} className="w-4" alt=">" />
          </div>
        )}
        {/* My Orders */}
        <Link
          to="/my-orders"
          className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
        >
          <span>My Orders</span>
          <img src={assets.black_arrow_icon} className="w-4" alt=">" />
        </Link>

        {/* Profile Details */}
        <Link
          to="/profile"
          className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
        >
          <span>Profile Details</span>
          <img src={assets.black_arrow_icon} className="w-4" alt=">" />
        </Link>

        {/* Contact Us */}
        <Link
          to="/contact"
          className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
        >
          <span>Contact Us</span>
          <img src={assets.black_arrow_icon} className="w-4" alt=">" />
        </Link>

        {/* Sign Out */}
        {user && (
          <button
            onClick={logout}
            className="flex items-center justify-between py-4 text-red-600 hover:bg-red-50 px-1 transition"
          >
            <span>Sign Out</span>
            <img
              src={assets.logout || assets.black_arrow_icon}
              className="w-4"
              alt=">"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Account;
