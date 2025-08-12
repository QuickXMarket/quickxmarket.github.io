import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import AccountOption from "../components/AccountOption";
import { useAuthContext } from "../context/AuthContext";
import ProfileIcon from "../assets/person-circle.svg?react";

const Account = () => {
  const { admin, logout } = useAuthContext();

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-xl mx-auto">
        {/* Greeting */}
        <div className="px-4 py-6 sm:px-6 md:px-10 lg:px-16 text-center mb-6">
          <ProfileIcon className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
          <h1 className="text-2xl font-semibold">
            {admin ? `Welcome, ${admin.name}` : "Welcome, Guest"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {admin
              ? "Manage your account settings"
              : "Sign in to access more features"}
          </p>
        </div>

        {/* Options List */}
        <div className="flex flex-col text-sm divide-y divide-gray-200">
          <AccountOption
            to="/vendor-requests"
            label="Vendor Requests"
            icon={assets.black_arrow_icon}
          />
          <AccountOption
            to="/rider-requests"
            label="Rider Requests"
            icon={assets.black_arrow_icon}
          />
          {/* Sign Out */}
          {admin ? (
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
    </div>
  );
};

export default Account;
