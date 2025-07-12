import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import RiderLogin from "../../components/rider/RiderLogin";

const RiderLayout = () => {
  const { user, makeRequest, navigation, location } = useAppContext();

  const [showLogin, setShowLogin] = useState(false);
  const [riderName, setRiderName] = useState("");
  const [riderId, setRiderId] = useState("");

  useEffect(() => {
    const verifyRider = async () => {
      if (!user || !user.isRider) {
        setShowLogin(true);
        return;
      }
      try {
        const data = await makeRequest({
          url: `/api/rider/user/${user._id}`,
          method: "GET",
        });

        if (data.success) {
          setRiderName(data.rider.name || user.name);
          setRiderId(data.rider._id);
          setShowLogin(false);
        } else {
          toast.error("Not a valid rider account");
          setShowLogin(true);
        }
      } catch (error) {
        toast.error("Failed to verify rider");
        setShowLogin(true);
      }
    };
    verifyRider();
  }, [user, makeRequest]);

  const navLinks = [
    { name: "Home", path: "/rider", icon: assets.home_icon },
    { name: "Wallet", path: "/rider/wallet", icon: assets.wallet_icon },
    { name: "Profile", path: "/rider/profile", icon: assets.profile_icon },
  ];

  if (showLogin) return <RiderLogin setShowUserLogin={setShowLogin} />;

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img
            src={assets.QuickXMarket_Logo_Transparent}
            alt="logo"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>
        <div className="text-gray-500 text-sm truncate">Hi! {riderName}</div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar - only visible on large screens */}
        <div className="hidden lg:flex lg:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex-col">
          {navLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/rider"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                    : "hover:bg-gray-100/90 border-white"
                }`
              }
            >
              <img src={item.icon} alt="" className="w-6 h-6" />
              <p className="md:block hidden">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Main Page Content */}
        <div className="flex-grow pb-16 lg:pb-0">
          <Outlet context={{ riderId }} />
        </div>
      </div>

      {/* Bottom Navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-sm flex justify-around py-2 lg:hidden">
        {navLinks.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/rider"}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-primary" : "text-gray-500"
              }`}
            >
              <img src={item.icon} className="w-6 h-6" alt={item.name} />
              <span className="text-[11px]">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default RiderLayout;
