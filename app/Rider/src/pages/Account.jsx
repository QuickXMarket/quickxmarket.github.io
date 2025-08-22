import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import AccountOption from "../components/AccountOption";
import { useAuthContext } from "../context/AuthContext";
import ProfileIcon from "../assets/person-circle.svg?react";
import ArrowIcon from "../assets/black_arrow_icon.svg?react";
import LogOutIcon from "../assets/logout.svg?react";
import TrashIcon from "../assets/trash.svg?react";
import ThemeSelector from "../components/ThemeSelector";
import ChangePasswordModal from "../components/ChangePassword";

const Account = () => {
  const { user, setUser, logout, rider } = useAuthContext();
  const [themeModal, setThemeModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  return (
    <div className="max-w-xl mx-auto">
      {/* Greeting */}
      <div className="px-4 py-6 sm:px-6 md:px-10 lg:px-16 text-center mb-6">
        <ProfileIcon className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
        <h1 className="text-2xl font-semibold">{`Welcome, ${user.name}`}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account settings
        </p>
      </div>

      <div className="flex flex-col text-sm divide-y divide-gray-200">
        <AccountOption
          label="Change Theme"
          Icon={ArrowIcon}
          onClick={() => setThemeModal(true)}
        />
        <AccountOption
          to="/faq"
          label="FAQ"
          Icon={ArrowIcon}
          onClick={() => setShowUserLogin(true)}
        />
        <AccountOption to="/feedback" label="Send Feedback" Icon={ArrowIcon} />
        <AccountOption
          label="Change Password"
          Icon={ArrowIcon}
          onClick={() => setPasswordModal(true)}
        />
        {user && (
          <button
            onClick={logout}
            className="flex items-center justify-between py-4 text-red-600 hover:bg-red-50 px-1 transition "
          >
            <span>Sign Out</span>

            <LogOutIcon className="w-4 h-4 " />
          </button>
        )}
        <button
          // onClick={handleDeleteAccount}
          className="flex items-center justify-between py-4 text-red-700 hover:bg-red-100 px-1 transition"
        >
          <span>Delete Account</span>
          <TrashIcon className="w-4 h-4 " />
        </button>
        {/* 
        <AccountOption
          to="/feedback"
          label="Terms and Conditions"
          Icon={ArrowIcon}
          onClick={() => setShowUserLogin(true)}
        /> */}

        <ThemeSelector open={themeModal} onClose={() => setThemeModal(false)} />
        {passwordModal && (
          <ChangePasswordModal onClose={() => setPasswordModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Account;
