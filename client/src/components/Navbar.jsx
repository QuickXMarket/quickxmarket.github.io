import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    setShowSellerLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <div>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img
            className="h-9"
            src={assets.QuickXMarket_Logo_Transparent}
            alt="logo"
          />
        </NavLink>

        <div className="hidden sm:flex items-center gap-8">
          {user &&
            (user.role === "vendor" ? (
              <NavLink to="/seller">
                <button className="border border-gray-300 px-3 py-1 rounded-full text-xs cursor-pointer opacity-80">
                  Seller Dashboard
                </button>
              </NavLink>
            ) : user.role === "customer" ? (
              <button
                className="border border-gray-300 px-3 py-1 rounded-full text-xs cursor-pointer opacity-80"
                onClick={() => {
                  setShowSellerLogin(true);
                }}
              >
                Register as a Vendor
              </button>
            ) : null)}

          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">All Product</NavLink>
          {/* <NavLink to="/">Contact</NavLink> */}

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>
          <img
            src={assets.search_icon}
            alt="search"
            className="hidden sm:flex lg:hidden w-5 h-5 cursor-pointer opacity-80"
            onClick={() => setSearchOpen(!searchOpen)}
          />

          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img src={assets.profile_icon} className="w-10" alt="" />
              <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                <li
                  onClick={() => navigate("my-orders")}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 sm:hidden">
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>
          <button
            onClick={() => (open ? setOpen(false) : setOpen(true))}
            aria-label="Menu"
            className=""
          >
            <img src={assets.menu_icon} alt="menu" />
          </button>
        </div>

        {open && (
          <div class="absolute z-50 top-14.5 left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-4 px-5 md:hidden">
            <div class="flex flex-col gap-4 md:hidden">
              <NavLink
                aria-current="page"
                class="active"
                to="/"
                data-discover="true"
              >
                Home
              </NavLink>
              <NavLink class="" to="/products" data-discover="true">
                All Product
              </NavLink>
              <NavLink class="" to="/shops" data-discover="true">
                Shops
              </NavLink>
              {user && (
                <NavLink to="/products" onClick={() => setOpen(false)}>
                  My Orders
                </NavLink>
              )}

              {user &&
                (user.role === "vendor" ? (
                  <NavLink className="" to="/seller" data-discover="true">
                    Seller Dashboard
                  </NavLink>
                ) : user.role === "customer" ? (
                  <NavLink
                    className=""
                    data-discover="true"
                    onClick={() => {
                      setOpen(false);
                      setShowSellerLogin(true);
                    }}
                  >
                    Register as a Vendor
                  </NavLink>
                ) : null)}
            </div>
            <div className="w-full border border-gray-300 px-3 py-1.5 rounded-full flex items-center gap-2">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full placeholder-gray-500 text-sm"
                type="text"
                placeholder="Search products"
              />
              <img src={assets.search_icon} alt="search" className="w-4 h-4" />
            </div>

            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
      {searchOpen && (
        <div className="hidden sm:flex lg:hidden items-center text-sm gap-2 border border-gray-300 px-3 rounded-full mx-3 mt-2">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default Navbar;
