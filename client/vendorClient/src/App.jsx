import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ChatDotIcon from "./assets/chat-dots.svg?react";
import Login from "./components/Login";
import SellerLogin from "./components/SellerLogin";
import Layout from "./pages/Layout";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Orders from "./pages/Orders";
import Loading from "./components/Loading";
import Contact from "./pages/Contact";
import { useAuthContext } from "./context/AuthContext";
import { useCoreContext } from "./context/CoreContext";
import Wallet from "./pages/Wallet";
import ChatLayout from "./pages/ChatLayout";
import { useChatContext } from "./context/ChatContext";

const App = () => {
  const { navigate, location } = useCoreContext();
  const isContactPath = location.pathname.includes("contact");
  const { showUserLogin, isSeller, showSellerLogin, user, loading } =
    useAuthContext();
  const { showChatModal, setShowChatModal } = useChatContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {showUserLogin ? <Login /> : null}
      {showSellerLogin ? <SellerLogin /> : null}

      <Toaster />

      <div>
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
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
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wallet" element={<Wallet />} />
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
    </div>
  );
};

export default App;
