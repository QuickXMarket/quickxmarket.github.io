import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import SellerLogin from "./pages/SellerLogin";
import Layout from "./pages/Layout";
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

const App = () => {
  const { isSeller, user, authLoading } = useAuthContext();
  const { keyboardVisible, location, navigate } = useCoreContext();
  const isContactPath = location.pathname.includes("contact");

  const showBottomNav =
    ["/", "/shops", "/dispatch", "/wishlist", "/account"].includes(
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
      <Toaster />
      <div
        className={`${
          isContactPath ? "px-2 md:px-16 lg:px-24 xl:px-32 h-screen" : ""
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              authLoading ? (
                <Loading />
              ) : !user ? (
                <Login />
              ) : isSeller ? (
                <Layout />
              ) : (
                <SellerLogin />
              )
            }
          >
            <Route index element={isSeller ? <Orders /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="/account" element={<Account />} />
          </Route>

          <Route path="/contact" element={<Contact />} />
          <Route path="/loader" element={<Loading />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
