import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";
import ChatDotIcon from "../assets/chat-dots.svg?react";

const Navbar = () => {
  const { navigate, theme } = useCoreContext();

  return (
    <div className="">
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-border bg-background relative transition-all">
        <div onClick={() => navigate("/")}>
          <img
            className="h-6 sm:h-7 lg:h-9"
            src={
              theme === "dark"
                ? assets.QuickXMarket_Logo_Transparent_2
                : assets.QuickXMarket_Logo_Transparent_1
            }
            alt="logo"
          />
        </div>

        <ChatDotIcon
          className="scale-x-[-1] w-8 w-8 "
          onClick={() => navigate("/contact")}
        />
      </nav>
    </div>
  );
};

export default Navbar;
