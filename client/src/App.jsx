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
import ChatLayout from "./pages/ChatLayout";
import { useChatContext } from "./context/ChatContext";
import ResetPassword from "./pages/ResetPassword";
import FAQ from "./pages/FAQ";
import CustomerTerms from "./pages/CustomerTerms";
import RiderTerms from "./pages/RiderTerms";

const App = () => {
  const { navigate, location } = useCoreContext();
  const isContactPath = location.pathname.includes("contact");
  const { showUserLogin, user, loading } = useAuthContext();
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
      {<Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div
        className={`${
          isContactPath
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
          <Route path="/faq" element={<FAQ />} />
          <Route path="/customer-terms" element={<CustomerTerms />} />
          <Route path="/rider-terms" element={<RiderTerms />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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
      {<Footer />}
    </div>
  );
};

export default App;
