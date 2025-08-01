import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import SellerLogin from "../components/SellerLogin";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";
import Navbar from "../components/Navbar";

const Layout = () => {
  const { user } = useAuthContext();
  const { axios } = useCoreContext();
  const [isVendor, setIsVendor] = React.useState(null);
  const [showSellerLogin, setShowSellerLogin] = React.useState(false);
  const [businessName, setBusinessName] = React.useState("");
  const [vendor, setVendor] = React.useState("");

  useEffect(() => {
    const checkVendorStatus = async () => {
      if (!user || !user.isSeller) {
        // Not a vendor role, redirect or show login
        setShowSellerLogin(true);
        return;
      }
      try {
        const { data } = await axios.get(`/api/seller/user/${user._id}`);
        if (data.success) {
          setBusinessName(data.vendor.businessName);
          setIsVendor(true);
          setShowSellerLogin(false);
          setVendor(data.vendor);
        } else {
          setIsVendor(false);
          setShowSellerLogin(true);
        }
      } catch (error) {
        toast.error("Failed to verify vendor status");
        setIsVendor(false);
        setShowSellerLogin(true);
      }
    };
    checkVendorStatus();
  }, [user, axios]);

  const sidebarLinks = [
    { name: "Add Product", path: "/dashboard", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/dashboard/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/dashboard/orders", icon: assets.order_icon },
    { name: "Wallet", path: "/dashboard/wallet", icon: assets.wallet_outline },
  ];

  if (showSellerLogin) {
    return <SellerLogin setShowUserLogin={setShowSellerLogin} />;
  }

  return (
    <>
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
        </div>
      </div>
      <div className="flex">
        {/* Sidebar for md and up */}
        <div className="md:w-64 w-0 hidden md:flex border-r h-[95vh] text-base border-gray-300 pt-4 flex-col">
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
              <p className="md:block hidden ">{item.name}</p>
            </NavLink>
          ))}
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
