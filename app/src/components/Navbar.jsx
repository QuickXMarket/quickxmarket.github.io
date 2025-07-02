import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    user,
    setUser,
    setShowUserLogin,
    setShowSellerLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    makeRequest,
  } = useAppContext();
  const logout = async () => {
    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/user/logout",
      });

      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <div>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img
            className="h-5 sm:h-7 lg:h-9"
            src={assets.QuickXMarket_Logo_Transparent}
            alt="logo"
          />
        </NavLink>

        <div className="hidden sm:flex items-center gap-8">
          {user &&
            (user.role === "vendor" ? (
              <NavLink to="/seller">
                <button className="border border-gray-300 px-3 py-1 rounded-full text-xs cursor-pointer opacity-80">
                  Seller Dashboard
                </button>
              </NavLink>
            ) : user.role === "customer" ? (
              <button
                className="border border-gray-300 px-3 py-1 rounded-full text-xs cursor-pointer opacity-80"
                onClick={() => {
                  setShowSellerLogin(true);
                }}
              >
                Register as a Vendor
              </button>
            ) : null)}

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
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <Link to="/account">
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
          {!user ? (
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
          )}
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
