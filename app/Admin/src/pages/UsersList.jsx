import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { assets } from "../assets/assets";
import { useAdminContext } from "../context/AdminContext";

const UserList = () => {
  const { users } = useAdminContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery) ||
          user._id.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);
  return (
    <div className="px-4 pt-3 pb-6">
      {/* Search Input */}
      <label className="flex flex-col min-w-40 h-12 w-full mb-4">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card">
          <div className="text-primary flex items-center justify-center pl-4 rounded-l-lg bg-card border-r border-border">
            <Search className="w-5 h-5" />
          </div>
          <input
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input flex-1 bg-card text-text placeholder:text-gray-500 focus:outline-none focus:ring-0 border-none px-4 rounded-r-lg text-base"
          />
        </div>
      </label>

      {/* User Items */}
      {filteredUsers.map((user, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 bg-card px-4 min-h-[72px] py-2 rounded-lg mb-2"
        >
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 shrink-0"
            style={{ backgroundImage: `url(${assets.profile_icon})` }}
          ></div>
          <div className="flex flex-col justify-center">
            <p className="text-text text-base font-medium leading-normal line-clamp-1">
              {user.name}
            </p>
            <p className="text-gray-500 text-sm font-normal leading-normal line-clamp-2">
              {user.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
