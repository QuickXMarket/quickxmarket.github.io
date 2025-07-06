import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import SellerLogin from "../../components/seller/SellerLogin";

const SellerLayout = () => {
  const { makeRequest, user } = useAppContext();
  const navigate = useNavigate();

  const [isVendor, setIsVendor] = React.useState(null);
  const [showSellerLogin, setShowSellerLogin] = React.useState(false);
  const [businessName, setBusinessName] = React.useState("");

  useEffect(() => {
    const checkVendorStatus = async () => {
      if (!user || user.role !== "vendor") {
        // Not a vendor role, redirect or show login
        setShowSellerLogin(true);
        return;
      }
      try {
        const data = await makeRequest({
          url: `/api/seller/user/${user._id}`,
          method: "GET",
        });
        if (data.success) {
          setBusinessName(data.vendor.businessName);
          setIsVendor(true);
          setShowSellerLogin(false);
        } else {
          setIsVendor(false);
          setShowSellerLogin(true);
        }
      } catch (error) {
        toast.error("Failed to verify vendor status");
        setIsVendor(false);
        setShowSellerLogin(true);
      }
    };
    checkVendorStatus();
  }, [user, makeRequest]);

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  if (showSellerLogin) {
    return <SellerLogin setShowUserLogin={setShowSellerLogin} />;
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img
            src={assets.QuickXMarket_Logo_Transparent}
            alt="log"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p className="truncate w-20 sm:w-full">Hi! {businessName}</p>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar - visible on lg and up */}
        <div className="hidden lg:flex lg:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
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

        {/* Page Content */}
        <div className="flex-grow pb-16 lg:pb-0">
          <Outlet />
        </div>
      </div>

      {/* Bottom Nav for mobile - visible only on < lg */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-sm flex justify-around py-2 lg:hidden">
        {sidebarLinks.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
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

export default SellerLayout;
