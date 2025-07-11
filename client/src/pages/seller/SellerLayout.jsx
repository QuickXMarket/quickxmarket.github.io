import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import SellerLogin from "../../components/seller/SellerLogin";

const SellerLayout = () => {
  const { axios, user } = useAppContext();
  const navigate = useNavigate();

  const [isVendor, setIsVendor] = React.useState(null);
  const [showSellerLogin, setShowSellerLogin] = React.useState(false);
  const [businessName, setBusinessName] = React.useState("");

  useEffect(() => {
    const checkVendorStatus = async () => {
      if (!user || !user.isSeller) {
        // Not a vendor role, redirect or show login
        setShowSellerLogin(true);
        return;
      }
      try {
        const { data } = await axios.get(`/api/seller/user/${user._id}`);
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
  }, [user, axios]);

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
        <Outlet />
      </div>
    </>
  );
};

export default SellerLayout;
