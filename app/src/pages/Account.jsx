import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import AccountOption from "../components/AccountOption";
import { useAuthContext } from "../context/AuthContext";

const Account = () => {
  const {
    user,
    setUser,
    setShowSellerLogin,
    setShowUserLogin,
    setShowRiderLogin,
    logout,
  } = useAuthContext();

  return (
    <div className="max-w-xl mx-auto">
      {/* Greeting */}
      <div className="px-4 py-6 sm:px-6 md:px-10 lg:px-16 text-center mb-6">
        <img
          src={assets.account_icon}
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
        />
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
        {user && (
          <>
            {user.isSeller ? (
              <Link
                to="/seller"
                className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
              >
                <span>Seller Dashboard</span>
                <img src={assets.black_arrow_icon} className="w-4" alt=">" />
              </Link>
            ) : (
              <div
                className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
                onClick={() => setShowSellerLogin(true)}
              >
                <span>Register as a Vendor</span>
                <img src={assets.black_arrow_icon} className="w-4" alt=">" />
              </div>
            )}

            {user.isRider ? (
              <Link
                to="/rider"
                className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
              >
                <span>Rider Dashboard</span>
                <img src={assets.black_arrow_icon} className="w-4" alt=">" />
              </Link>
            ) : (
              <div
                className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition"
                onClick={() => setShowRiderLogin(true)}
              >
                <span>Register as a Rider</span>
                <img src={assets.black_arrow_icon} className="w-4" alt=">" />
              </div>
            )}
          </>
        )}

        <AccountOption
          to="/my-orders"
          label="My Orders"
          icon={assets.black_arrow_icon}
          onClick={() => setShowUserLogin(true)}
        />

        {/* Profile Details */}
        <AccountOption
          to="/profile"
          label="Profile Details"
          icon={assets.black_arrow_icon}
          onClick={() => setShowUserLogin(true)}
        />

        {/* Contact Us */}
        <AccountOption
          to="/contact"
          label="Contact Us"
          icon={assets.black_arrow_icon}
          onClick={() => setShowUserLogin(true)}
        />

        {/* Sign Out */}
        {user ? (
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
        ) : (
          <button
            onClick={() => setShowUserLogin(true)}
            className="flex items-center justify-between py-4 text-primary hover:bg-gray-50 px-1 transition"
          >
            <span>Sign In</span>
            <img
              src={assets.login || assets.black_arrow_icon}
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
