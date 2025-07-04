import React from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
// import { ReactComponent as Shop } from "../assets/shop.svg";

const navItems = [
  { name: "Home", path: "/", icon: assets.home_icon },
  { name: "Shops", path: "/shops", icon: assets.shop_icon },
  { name: "Wishlist", path: "/wishlist", icon: assets.wishlist_icon },
  { name: "Account", path: "/account", icon: assets.account_icon },
];

const BottomNavbar = () => {
  const { navigate, location } = useAppContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-sm flex justify-around py-2 md:hidden">
      {/* <ShopIcon /> */}
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-primary" : "text-gray-500"
            }`}
          >
            <img src={item.icon} alt={item.name} className="w-6 h-6 mb-0.5 " />
            <span className="text-[11px]">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
