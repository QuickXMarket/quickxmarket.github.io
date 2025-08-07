import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ChatDotIcon from "./assets/chat-dots.svg?react";
import Login from "./components/Login";
import SellerLogin from "./components/SellerLogin";
import Layout from "./pages/Layout";
import ProductList from "./pages/ProductList";
import Orders from "./pages/Orders";
import Loading from "./components/Loading";
import Feedback from "./pages/Feedback";
import { useAuthContext } from "./context/AuthContext";
import { useCoreContext } from "./context/CoreContext";
import Wallet from "./pages/Wallet";
import ChatLayout from "./pages/ChatLayout";
import { useChatContext } from "./context/ChatContext";
import Home from "./pages/Home";
import TermsandConditions from "./pages/TermsandConditions";
import { useVendorContext } from "./context/VendorContext";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { navigate, location } = useCoreContext();
  const isContactPath = location.pathname.includes("contact");

  const { showUserLogin, isSeller, showSellerLogin, user, loading } =
    useAuthContext();
  const { showChatModal, setShowChatModal } = useChatContext();
  const { loading: vendorLoading } = useVendorContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {showUserLogin ? <Login /> : null}
      {showSellerLogin ? <SellerLogin /> : null}
      <Toaster />

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsandConditions />}
          />
          <Route path="/feedback" element={<Feedback />} />
          <Route
            path="/dashboard"
            element={
              loading ? (
                <Loading />
              ) : !user ? (
                <Login />
              ) : isSeller ? (
                vendorLoading ? (
                  <Loading />
                ) : (
                  <Layout />
                )
              ) : (
                <SellerLogin />
              )
            }
          >
            <Route index element={isSeller ? <Dashboard /> : null} />
            <Route path="orders" element={<Orders />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="wallet" element={<Wallet />} />
          </Route>
        </Routes>
      </div>
      {!isContactPath && user && (
        <div className="fixed bottom-20 md:bottom-6 right-6 sm:right-10 lg:right-14 z-50">
          <button
            onClick={() => {
              if (user) {
                setShowChatModal(true);
              }
            }}
            className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
          >
            <ChatDotIcon className={"w-8 h-8"} />
          </button>
        </div>
      )}

      {user && showChatModal && <ChatLayout />}
    </div>
  );
};

export default App;
