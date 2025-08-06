import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router";
import { useCoreContext } from "../context/CoreContext";

const ChatTopBar = () => {
    const { theme } = useCoreContext();
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-border py-3 bg-background">
      <Link to="/">
        <img
          src={
            theme === "dark"
              ? assets.QuickXMarket_Logo_Transparent_2
              : assets.QuickXMarket_Logo_Transparent_1
          }
          alt="logo"
          className="cursor-pointer w-34 md:w-38"
        />
      </Link>
      {/* <div className="text-gray-500 text-sm truncate">Hi! {user?.name}</div> */}
      <div className="text-gray-500 text-sm truncate">Customer Support</div>
    </div>
  );
};

export default ChatTopBar;
