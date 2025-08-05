import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import SellerLogin from "../components/SellerLogin";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";

const Layout = () => {
  const { user, businessName, vendor, setShowUserLogin, logout, setVendor } =
    useAuthContext();
  const [open, setOpen] = React.useState(false);
  const { navigate, location, axios } = useCoreContext();
  const [showSellerLogin, setShowSellerLogin] = React.useState(false);

  const sidebarLinks = [
    { name: "Orders", path: "/dashboard", icon: assets.order_icon },
    {
      name: "Product List",
      path: "/dashboard/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Wallet", path: "/dashboard/wallet", icon: assets.wallet_outline },
  ];

  const handleOpenToggle = async () => {
    if (!vendor || !user) {
      toast.error("Please login to toggle your status.");
      return;
    }
    try {
      const { data } = await axios.patch("/api/seller/toggle-status");
      if (data.success) {
        toast.success(`You are now ${!vendor.isOpen ? "open" : "closed"}`);
        setVendor((prev) => ({ ...prev, isOpen: !prev.isOpen }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error toggling vendor status:", error);
      toast.error("Failed to toggle vendor status.");
    }
  };

  if (showSellerLogin) {
    return <SellerLogin setShowUserLogin={setShowSellerLogin} />;
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white h-[8vh]">
        <Link to="/">
          <img
            src={assets.QuickXMarket_Logo_Transparent}
            alt="log"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>
        {/* <div className="flex items-center gap-5 text-gray-500">
          <p className="truncate w-20 sm:w-full">Hi! {businessName}</p>
        </div> */}
        <div className="block relative">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="flex items-center gap-2"
          >
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 bg-white w-60 shadow-lg border rounded-md text-sm z-50 px-4 py-3">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={vendor.profilePhoto || assets.profile_icon}
                  className="w-10 h-10 rounded-full"
                  alt="Profile"
                />
                <div>
                  <p className="text-xs text-gray-500">Welcome</p>
                  <p className="font-semibold text-gray-700">
                    {businessName ? businessName : "Guest"}
                  </p>
                  {vendor?.openingTime && vendor?.closingTime && (
                    <div className="text-xs text-gray-500">
                      <span>Business Hours: </span>
                      <span>{`${vendor?.openingTime} -${vendor?.closingTime}`}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <ul className="flex flex-col gap-2">
                <li className="hover:bg-gray-100 rounded px-2 py-1 cursor-pointer flex items-center gap-2">
                  <span className="text-sm">Online</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={vendor?.isOpen}
                      onChange={handleOpenToggle}
                    />
                    <div className="w-6 h-4 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                    <span className="dot absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-2.5"></span>
                  </label>
                </li>

                <li
                  onClick={() => {
                    setOpen(false);
                    navigate("/my-orders");
                  }}
                  className="hover:bg-gray-100 rounded px-2 py-1 cursor-pointer"
                >
                  Business Details
                </li>

                <li
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="hover:bg-gray-100 rounded px-2 py-1 cursor-pointer"
                >
                  Profile Details
                </li>
                {!user ? (
                  <li
                    onClick={() => {
                      setOpen(false);
                      setShowUserLogin(true);
                    }}
                    className="hover:bg-primary/10 rounded px-2 py-1 cursor-pointer text-primary"
                  >
                    Login
                  </li>
                ) : (
                  <li
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="hover:bg-red-50 rounded px-2 py-1 cursor-pointer text-red-500"
                  >
                    Logout
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex">
        {/* Sidebar for md and up */}
        <div className="md:w-64 w-0 hidden md:flex border-r h-[92vh] text-base border-gray-300 pt-4 flex-col justify-between">
          <div>
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 gap-3 
          ${
            isActive
              ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
              : "hover:bg-gray-100/90 border-white"
          }`
                }
              >
                <img src={item.icon} alt="" className="w-7 h-7" />
                <p className="md:block hidden">{item.name}</p>
              </NavLink>
            ))}
          </div>

          {/* Welcome message at the bottom */}
          <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200">
            <p className="font-medium text-primary">Welcome back!</p>
            <p className="text-xs mt-1">
              Manage your store and track performance with ease.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 pb-16 md:pb-0">
          <Outlet context={{ vendor }} />
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 flex justify-around py-2">
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                to={item.path}
                key={item.name}
                className={`flex flex-1 flex-col items-center text-xs ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Layout;
