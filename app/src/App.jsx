import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
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
import Account from "./pages/Account";
import BottomNavbar from "./components/BottomNavbar";
import WishList from "./pages/WishList";

const App = () => {
  const { showUserLogin, isSeller, showSellerLogin, user, loading, location } =
    useAppContext();
  const isSellerPath = location.pathname.includes("seller");

  const showBottomNav = ["/", "/shops", "/wishlist", "/account"].includes(
    location.pathname
  );

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white mt-8">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      {showSellerLogin && <SellerLogin />}
      <Toaster />
      <div className={isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}>
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<WishList />} />
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
      {showBottomNav && <BottomNavbar />}
    </div>
  );
};

export default App;
