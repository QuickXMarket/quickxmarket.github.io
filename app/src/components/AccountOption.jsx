import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const AccountOption = ({ to, label, onClick, icon }) => {
  const { user } = useAuthContext();
  const isLoggedIn = !!user;

  const content = (
    <div className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition">
      <span>{label}</span>
      <img src={icon} className="w-4" alt=">" />
    </div>
  );

  return isLoggedIn ? (
    <Link to={to} className="block">
      {content}
    </Link>
  ) : (
    <div className="block" onClick={onClick}>
      {content}
    </div>
  );
};

export default AccountOption;
