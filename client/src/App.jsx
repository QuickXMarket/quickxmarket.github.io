import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
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

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const isRiderPath = useLocation().pathname.includes("rider");
  const isContactPath = location.pathname.includes("Contact");
  const { showUserLogin, isSeller, showSellerLogin, user, loading } =
    useAuthContext();
  const { navigate } = useCoreContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerPath || isRiderPath || isContactPath ? null : <Navbar />}
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
          </Route>
        </Routes>
      </div>
      {!isContactPath && (
        <div className="fixed bottom-6 right-6 sm:right-10 lg:right-14 z-50">
          <button
            onClick={() => navigate("/Contact")}
            className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
          >
            <ChatDotIcon className={"w-8 h-8"} />
          </button>
        </div>
      )}
      {!(isSellerPath || isRiderPath || isContactPath) && <Footer />}
    </div>
  );
};

export default App;
