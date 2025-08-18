import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Loading from "./components/Loading";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import BottomNavbar from "./components/BottomNavbar";
import { SplashScreen } from "@capacitor/splash-screen";
import Layout from "./pages/Layout";
import RiderLogin from "./pages/RiderLogin";
import Orders from "./pages/Orders";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import { useAuthContext } from "./context/AuthContext";
import { useCoreContext } from "./context/CoreContext";

const App = () => {
  const { isRider, user, authLoading } = useAuthContext();
  const { keyboardVisible, location, navigate } = useCoreContext();

  const isRiderPath = location.pathname.includes("rider");
  const isContactPath = location.pathname.includes("contact");

  const showBottomNav =
    ["/", "/wallet", "/profile"].includes(location.pathname) &&
    !keyboardVisible;

  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hide();
    };
    if (!authLoading) {
      setTimeout(() => {
        hideSplashScreen();
      }, 1000);
    }
  }, [authLoading]);

  const params = new URLSearchParams(location.search);
  const contactParam = params.get("contact");

  useEffect(() => {
    if (contactParam === "true") {
      navigate("/contact");
    }
  }, [contactParam]);

  return (
    <div className="text-default min-h-screen text-gray-700 bg-background ">
      {!isContactPath && <Navbar />}
      <Toaster />
      <div
        className={
          isRiderPath
            ? ""
            : isContactPath
            ? "px-2 md:px-16 lg:px-24 xl:px-32 h-screen"
            : ""
        }
      >
        {authLoading ? (
          <Loading />
        ) : !user ? (
          <Login />
        ) : !isRider ? (
          <RiderLogin />
        ) : (
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}

            <Route path="/" element={<Orders />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/loader" element={<Loading />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        )}
      </div>
      {showBottomNav && <BottomNavbar />}
    </div>
  );
};

export default App;
