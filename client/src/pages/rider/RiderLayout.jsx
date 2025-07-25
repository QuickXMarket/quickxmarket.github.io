import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useCoreContext } from "../../context/CoreContext";

const RiderLayout = () => {
  const { user } = useAuthContext();
  const { axios } = useCoreContext();
  const [riderName, setRiderName] = React.useState("");
  const [rider, setRider] = React.useState("");

  useEffect(() => {
    const checkVendorStatus = async () => {
      if (!user || !user.isRider) {
        return;
      }
      try {
        const { data } = await axios.get(`/api/rider/user/${user._id}`);
        if (data.success) {
          setRiderName(data.rider.name);
          setRider(data.rider);
        } else {
        }
      } catch (error) {
        toast.error("Failed to verify rider status");
      }
    };
    checkVendorStatus();
  }, [user, axios]);

  const sidebarLinks = [
    { name: "Home", path: "/rider", icon: assets.home_outline },
    { name: "Wallet", path: "/rider/wallet", icon: assets.wallet_outline },
    { name: "Profile", path: "/rider/profile", icon: assets.profile_outline },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img
            src={assets.QuickXMarket_Logo_Transparent}
            alt="log"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p className="truncate w-20 sm:w-full">Hi! {riderName}</p>

          {/* <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button> */}
        </div>
      </div>
      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/rider"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 
                            ${
                              isActive
                                ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                : "hover:bg-gray-100/90 border-white"
                            }`
              }
            >
              <img src={item.icon} alt="" className="w-7 h-7" />
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <Outlet context={{ rider }} />
      </div>
    </>
  );
};

export default RiderLayout;
