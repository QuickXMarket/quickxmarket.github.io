import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const AccountOption = ({ to, label, onClick, Icon }) => {
  const { user } = useAuthContext();
  const isLoggedIn = !!user;

  const content = (
    <div className="flex items-center justify-between py-4 hover:bg-gray-50 px-1 transition">
      <span>{label}</span>
      <Icon className="w-4" />
    </div>
  );

  return isLoggedIn && to ? (
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
