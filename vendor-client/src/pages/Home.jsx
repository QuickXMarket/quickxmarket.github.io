import React from "react";
import MainBanner from "../components/MainBanner";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";

const Home = () => {
  const { user } = useAuthContext();
  return (
    <>
      <div>
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
          <NavLink to="/">
            <img
              className="h-6 sm:h-7 lg:h-9"
              src={assets.QuickXMarket_Logo_Transparent}
              alt="logo"
            />
          </NavLink>

          <div className="flex sm:hidden items-center gap-8">
            {user &&
              (user.isSeller ? (
                <NavLink to="/seller">
                  <button className="border border-gray-300 px-3 py-1 rounded-full text-xs cursor-pointer opacity-80">
                    Dashboard
                  </button>
                </NavLink>
              ) : !user.isSeller ? (
                <button
                  className="border border-gray-300 px-3 py-1 rounded-full text-xs cursor-pointer opacity-80"
                  onClick={() => {
                    setShowSellerLogin(true);
                  }}
                >
                  Register as a Vendor
                </button>
              ) : null)}
          </div>
          <div className="hidden sm:flex  gap-3">
            <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary  text-sm font-bold leading-normal tracking-[0.015em]">
              <span class="truncate">{`${user ? "Sign Out" : "Sign In"}`}</span>
            </button>
            {!user && (
              <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray-200  text-sm font-bold leading-normal tracking-[0.015em]">
                <span class="truncate">Sign Up</span>
              </button>
            )}
          </div>
        </nav>
      </div>
      <div className="mt-10">
        <MainBanner />
        {/* <Categories />
      <BestSeller />
      <BottomBanner/>
      <NewsLetter /> */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
