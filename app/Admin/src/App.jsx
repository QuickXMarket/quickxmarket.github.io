import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Orders from "./pages/Orders";
import Loading from "./components/Loading";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import { SplashScreen } from "@capacitor/splash-screen";
import Wallet from "./pages/Wallet";
import { useAuthContext } from "./context/AuthContext";
import { useCoreContext } from "./context/CoreContext";
import Passkey from "./pages/Passkey";
import BottomNavbar from "./components/BottomNavbar";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import UserList from "./pages/UsersList";
import ChatList from "./pages/ChatList";

const App = () => {
  const { loggedIn, admin, authLoading } = useAuthContext();
  const { keyboardVisible, location, navigate } = useCoreContext();
  const isContactPath = location.pathname.includes("contact");

  const showNavbars =
    ["/", "/users", "/orders", "/wallet", "/account"].includes(
      location.pathname
    ) && !keyboardVisible;

  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hide();
    };
    setTimeout(() => {
      hideSplashScreen();
    }, 1000);
  }, []);

  const params = new URLSearchParams(location.search);
  const contactParam = params.get("contact");

  useEffect(() => {
    if (contactParam === "true") {
      navigate("/contact");
    }
  }, [contactParam]);

  return (
    <div className="text-default min-h-screen text-gray-700 bg-background ">
      {showNavbars && admin && loggedIn && <Navbar />}
      <Toaster />
      <div
        className={`${
          isContactPath ? "px-2 md:px-16 lg:px-24 xl:px-32 h-screen" : ""
        }`}
      >
        {authLoading ? (
          <Loading />
        ) : !loggedIn ? (
          <Login />
        ) : !admin ? (
          <Passkey />
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/chatList" element={<ChatList />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/loader" element={<Loading />} />
            <Route path="/passkey" element={<Passkey />} />
          </Routes>
        )}
      </div>

      {showNavbars && admin && loggedIn && <BottomNavbar />}
    </div>
  );
};

export default App;
