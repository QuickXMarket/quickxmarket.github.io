import React from "react";
import { Link } from "react-router";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";
import ChatDotIcon from "../assets/chat-dots.svg?react";

const Navbar = () => {
  const { theme, navigate, location } = useCoreContext();

  // Map routes to headings
  const pageHeadings = [
    { pattern: /^\/contact(\/[^\/]+)?\/?$/, title: "Customer Support" },
    { pattern: /^\/chatList$/, title: "Customer Support" },
    { pattern: /^\/vendor-requests$/, title: "Vendor Requests" },
    { pattern: /^\/vendor-requests\/[^\/]+\/?$/, title: "Vendor Request" },
  ];

  // Find matching heading
  const currentHeading =
    pageHeadings.find((p) => p.pattern.test(location.pathname))?.title || "";

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
      {currentHeading ? (
        <div className="text-gray-500 text-sm truncate">{currentHeading}</div>
      ) : (
        <div className="icons">
          <ChatDotIcon
            className="scale-x-[-1] w-8 w-8 "
            onClick={() => navigate("/chatList")}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
