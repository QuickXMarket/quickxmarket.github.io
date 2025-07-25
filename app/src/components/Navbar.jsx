import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";
import { useProductContext } from "../context/ProductContext";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  const { user, setUser, setShowUserLogin } = useAuthContext();
  const { navigate } = useCoreContext();
  const { searchQuery, setSearchQuery, getCartCount } = useProductContext();

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <div>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
        <div onClick={() => navigate("/")}>
          <img
            className="h-6 sm:h-7 lg:h-9"
            src={assets.QuickXMarket_Logo_Transparent}
            alt="logo"
          />
        </div>

        <div className="hidden sm:flex items-center gap-8">
          {/* Search bar on large screens */}
          <div className="hidden sm:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          {/* Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {/* Login / Profile */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="hidden lg:block cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <Link to="/account" className="hidden lg:block">
              <img src={assets.profile_icon} className="w-10" alt="profile" />
            </Link>
          )}
        </div>

        {/* Mobile View */}
        <div className="flex items-center gap-6 sm:hidden">
          {/* Search Icon */}
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 cursor-pointer opacity-80"
            onClick={() => setSearchOpen(!searchOpen)}
          />

          {/* Cart Icon */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {/* Login / Profile */}
          {/* {!user ? (
            <img
              src={assets.login} // Replace with your login icon asset
              className="w-6 cursor-pointer opacity-80 "
              onClick={() => setShowUserLogin(true)}
              alt="login"
            />
          ) : (
            <Link to="/account">
              <img src={assets.profile_icon} className="w-8" alt="profile" />
            </Link>
          )} */}
        </div>
      </nav>
      {searchOpen && (
        <div className="flex sm:hidden items-center text-sm gap-2 border border-gray-300 px-3 rounded-full mx-3 mt-2">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default Navbar;
