import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { assets } from "../assets/assets";
import { useAdminContext } from "../context/AdminContext";
import { useCoreContext } from "../context/CoreContext";

const UserList = () => {
  const { users, vendors, riders } = useAdminContext();
  const { navigate } = useCoreContext();
  const [activeTab, setActiveTab] = useState("Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  // Helper to get the current dataset
  const getCurrentData = () => {
    switch (activeTab) {
      case "Vendors":
        return vendors;
      case "Riders":
        return riders;
      default:
        return users;
    }
  };

  // Filter list whenever tab or search changes
  useEffect(() => {
    const data = getCurrentData();
    if (searchQuery.trim() === "") {
      setFilteredList(data);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.phone?.toLowerCase().includes(q) ||
          item._id?.toLowerCase().includes(q)
      );
      setFilteredList(filtered);
    }
  }, [searchQuery, activeTab, users, vendors, riders]);

  return (
    <div className="px-4 pt-3 pb-6">
      {/* Search Input */}
      <label className="flex flex-col min-w-40 h-12 w-full mb-4">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card">
          <div className="text-primary flex items-center justify-center pl-4 rounded-l-lg bg-card border-r border-border">
            <Search className="w-5 h-5" />
          </div>
          <input
            placeholder={`Search ${activeTab.toLowerCase()}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input flex-1 bg-card text-text placeholder:text-gray-500 focus:outline-none focus:ring-0 border-none px-4 rounded-r-lg text-base"
          />
        </div>
      </label>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        {["Users", "Vendors", "Riders"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery("");
            }}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors
              ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-card text-text hover:bg-muted"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List Items */}
      {filteredList.map((item, idx) => (
        <div
          key={idx}
          onClick={() => {
            navigate(
              activeTab === "Users"
                ? `/userDetails/${item._id}`
                : activeTab === "Vendors"
                ? `/vendorDetails/${item._id}`
                : ``
            );
          }}
          className="flex items-center gap-4 bg-card px-4 min-h-[72px] py-2 rounded-lg mb-2"
        >
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 shrink-0"
            style={{
              backgroundImage: `url(${
                item.profilePhoto || assets.profile_icon
              })`,
            }}
          ></div>
          <div className="flex flex-col justify-center">
            <p className="text-text text-base font-medium leading-normal line-clamp-1">
              {activeTab === "Vendors" ? item.businessName : item.name}
            </p>
            <p className="text-gray-500 text-sm font-normal leading-normal line-clamp-2">
              {activeTab === "Users" ? item.email : item.number}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
