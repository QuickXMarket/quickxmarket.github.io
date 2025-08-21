import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import AccountOption from "../components/AccountOption";
import { useAuthContext } from "../context/AuthContext";
import ProfileIcon from "../assets/person-circle.svg?react";
import ArrowIcon from "../assets/black_arrow_icon.svg?react";

const Account = () => {
  const { user, setUser, logout, rider } = useAuthContext();

  return (
    <div className="max-w-xl mx-auto">
      {/* Greeting */}
      <div className="px-4 py-6 sm:px-6 md:px-10 lg:px-16 text-center mb-6">
        <ProfileIcon className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
        <h1 className="text-2xl font-semibold">
          {`Welcome, ${user.name}` }
        </h1>
        <p className="text-sm text-gray-500 mt-1">
           Manage your account settings
        </p>
      </div>

      <div className="flex flex-col text-sm divide-y divide-gray-200">
        <AccountOption
          to="/profile"
          label="Profile Details"
          icon={assets.black_arrow_icon}
          onClick={() => setShowUserLogin(true)}
        />

        <AccountOption
          to="/feedback"
          label="Send Feedback"
          icon={assets.black_arrow_icon}
          onClick={() => setShowUserLogin(true)}
        />

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
