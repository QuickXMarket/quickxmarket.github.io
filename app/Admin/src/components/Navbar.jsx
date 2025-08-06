import React from "react";
import { Link } from "react-router";
import { assets } from "../assets/assets";
import ChatDotIcon from "../assets/chat-dots.svg?react";
import { useCoreContext } from "../context/CoreContext";

const Navbar = () => {
  const { theme, navigate } = useCoreContext();
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
      <ChatDotIcon
        className="scale-x-[-1] w-8 w-8 "
        onClick={() => navigate("/chatList")}
      />
    </div>
  );
};

export default Navbar;
