import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import ChatDotIcon from "./assets/chat-dots.svg?react";
import Footer from "./components/Footer";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import Loading from "./components/Loading";
import Contact from "./pages/Contact";
import FoodVendorProducts from "./pages/FoodVendorProducts";
import ShopList from "./pages/ShopList";
import ShopProducts from "./pages/ShopProducts";
import WishList from "./pages/WishList";
import { useAuthContext } from "./context/AuthContext";
import Dispatch from "./pages/Dispatch";
import DispatchRequest from "./pages/DispatchRequest";
import { useCoreContext } from "./context/CoreContext";
import VendorWallet from "./pages/seller/Wallet";
import RiderLogin from "./components/rider/RiderLogin";
import RiderLayout from "./pages/rider/RiderLayout";
import RiderWallet from "./pages/rider/RiderWallet";
import RidersOrders from "./pages/rider/RidersOrders";
import RiderProfile from "./pages/rider/RiderProfile";
import ChatLayout from "./pages/ChatLayout";
import { useChatContext } from "./context/ChatContext";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const { navigate, location } = useCoreContext();
  const isSellerPath = location.pathname.includes("seller");
  const isRiderPath = location.pathname.includes("rider");
  const isContactPath = location.pathname.includes("contact");
  const { showUserLogin, isSeller, isRider, showSellerLogin, user, loading } =
    useAuthContext();
  const { showChatModal, setShowChatModal } = useChatContext();
  const params = new URLSearchParams(location.search);
  const contactParam = params.get("contact");

  useEffect(() => {
    if (contactParam === "true") {
      setShowChatModal(true);
      const timeout = setTimeout(() => {
        const newParams = new URLSearchParams(location.search);
        newParams.delete("contact");
        navigate(`${location.pathname}?${newParams.toString()}`, {
          replace: true,
        });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [contactParam]);

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerPath || isRiderPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      {showSellerLogin ? <SellerLogin /> : null}

      <Toaster />

      <div
        className={`${
          isSellerPath || isRiderPath
            ? ""
            : isContactPath
            ? "flex flex-col h-screen"
            : "px-6 md:px-16 lg:px-24 xl:px-32"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route
            path="/products/food/:vendorId"
            element={<FoodVendorProducts />}
          />
          <Route
            path="/products/food/:vendorId/:id"
            element={<ProductCategory />}
          />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/shops" element={<ShopList />} />
          <Route path="/shops/:vendorId" element={<ShopProducts />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/dispatch-request" element={<DispatchRequest />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/seller"
            element={
              loading ? (
                <Loading />
              ) : !user ? (
                <Login />
              ) : isSeller ? (
                <SellerLayout />
              ) : (
                <SellerLogin />
              )
            }
          >
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wallet" element={<VendorWallet />} />
          </Route>
          <Route
            path="/rider"
            element={
              loading ? (
                <Loading />
              ) : !user ? (
                <Login />
              ) : isRider ? (
                <RiderLayout />
              ) : (
                <RiderLogin />
              )
            }
          >
            <Route index element={isRider ? <RidersOrders /> : null} />
            <Route path="wallet" element={<RiderWallet />} />
            <Route path="profile" element={<RiderProfile />} />
          </Route>
        </Routes>
      </div>
      {!isContactPath && (
        <div className="fixed bottom-6 right-6 sm:right-10 lg:right-14 z-50">
          <button
            onClick={() => {
              if (user) {
                setShowChatModal(true);
              } else {
                navigate("/contact");
              }
            }}
            className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
          >
            <ChatDotIcon className={"w-8 h-8"} />
          </button>
        </div>
      )}
      {user && showChatModal && <ChatLayout />}
      {!(isSellerPath || isRiderPath) && <Footer />}
    </div>
  );
};

export default App;
