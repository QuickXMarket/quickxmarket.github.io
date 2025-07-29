import React from "react";
import { assets } from "../assets/assets";
import HomeIcon from "../assets/house-door-fill.svg?react";
import WishlistIcon from "../assets/heart-fill.svg?react";
import AccountIcon from "../assets/person-circle.svg?react";
import ShopIcon from "../assets/shop.svg?react";
import TruckIcon from "../assets/delivery-van.svg?react";
import { useCoreContext } from "../context/CoreContext";

const navItems = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Shops", path: "/shops", icon: ShopIcon },
  { name: "Dispatch", path: "/dispatch", icon: TruckIcon },
  { name: "Wishlist", path: "/wishlist", icon: WishlistIcon },
  { name: "Account", path: "/account", icon: AccountIcon },
];

const BottomNavbar = () => {
  const { navigate, location } = useCoreContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-sm flex justify-around py-2 lg:hidden">
      {/* <ShopIcon /> */}
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-primary" : "text-gray-500	"
            }`}
          >
            <item.icon
              className={`w-6 h-6  ${
                isActive ? "text-primary" : "text-gray-500 "
              }`}
            />
            <span className="text-[11px]">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
