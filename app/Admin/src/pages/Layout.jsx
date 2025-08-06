import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";
import AddIcon from "../assets/add_icon.svg?react";
import ProductListIcon from "../assets/product_list_icon.svg?react";
import OrderIcon from "../assets/order_icon.svg?react";
import WalletIcon from "../assets/wallet_outline.svg?react";
import ChatDotIcon from "../assets/chat-dots.svg?react";
import AccountIcon from "../assets/person-circle.svg?react";

const Layout = () => {
  const { businessName, vendor } = useAuthContext();
  const { makeRequest, location, theme, navigate } = useCoreContext();
  console.log(vendor);

  const sidebarLinks = [
    { name: "Orders", path: "/", icon: OrderIcon },
    {
      name: "Product List",
      path: "/product-list",
      icon: ProductListIcon,
    },
    { name: "Add Product", path: "/add-product", icon: AddIcon },
    { name: "Wallet", path: "/wallet", icon: WalletIcon },
    { name: "Account", path: "/account", icon: AccountIcon },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-border py-3 bg-background">
        <div className="flex items-center gap-5 text-gray-500">
          <p className="truncate w-40 sm:w-full">Hi! {businessName}</p>
        </div>
        <ChatDotIcon
          className="scale-x-[-1] w-8 w-8 "
          onClick={() => navigate("/contact")}
        />
      </div>

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar - visible on lg and up */}
        <div className="hidden lg:flex lg:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
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
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Page Content */}
        <div className="flex-grow pb-16 lg:pb-0">
          <Outlet context={{ vendor }} />
        </div>
      </div>

      {/* Bottom Nav for mobile - visible only on < lg */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-sm flex justify-around py-2 lg:hidden">
        {sidebarLinks.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-primary" : "text-gray-500"
              }`}
            >
              <item.icon className="w-6 h-6" />
              {/* <img src={item.icon} className="w-6 h-6" alt={item.name} /> */}
              <span
                className={`text-[11px] ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Layout;
