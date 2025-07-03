import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { App as CapacitorApp } from "@capacitor/app";
import { Http } from "@capacitor-community/http";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = "₦";

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://quickxmarket-server.vercel.app";

  const makeRequest = async ({ method, url, data }) => {
    try {
      const response = await Http.request({
        method,
        url: `${baseUrl}${url}`,
        headers: {
          "Content-Type": "application/json",
        },
        data,
        webFetchExtra: {
          credentials: "include",
        },
      });
      return response.data;
    } catch (err) {
      throw new Error(err?.error || "Network Error");
    }
  };

  // Utility function to convert File to base64 string
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    let removeListener;

    const setupBackHandler = async () => {
      const handler = await CapacitorApp.addListener("backButton", () => {
        const currentPath = location.pathname;
        const exitPaths = ["/", "/home"];
        if (exitPaths.includes(currentPath)) {
          CapacitorApp.exitApp();
        } else {
          navigate(-1);
        }
      });

      removeListener = handler.remove;
    };

    setupBackHandler();

    const configureStatusBar = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });

        const isDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        await StatusBar.setStyle({
          style: isDark ? Style.Light : Style.Dark,
        });
      } catch (error) {
        console.warn("StatusBar config failed:", error);
      }
    };

    configureStatusBar();

    return () => {
      if (removeListener) removeListener();
    };
  }, [navigate, location]);

  const fetchUser = async () => {
    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/user/is-auth",
      });
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
        await Preferences.set({
          key: "user",
          value: JSON.stringify(data.user),
        });
      }
    } catch {
      setUser(null);
    }
  };

  const fetchSeller = async () => {
    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/user/is-auth",
      });
      setIsSeller(data.success && data.user.role === "vendor");
    } catch {
      setIsSeller(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/product/list",
      });
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add Product to Cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Remove Product from Cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from Cart");
    setCartItems(cartData);
  };

  // Get Cart Item Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0 && itemInfo) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const logout = async () => {
    try {
      const data = await makeRequest({
        url: "/api/user/logout",
        method: "GET",
      });
      if (data.success) {
        toast.success(data.message);
        await Preferences.remove({ key: "user" });
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedUser = await Preferences.get({ key: "user" });
        if (storedUser.value) {
          const parsedUser = JSON.parse(storedUser.value);
          setUser(parsedUser);
          setCartItems(parsedUser.cartItems || {});
        }
        await Promise.all([fetchUser(), fetchSeller(), fetchProducts()]);
      } catch (err) {
        // Optional: log or toast error
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Update Database Cart Items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const data = await makeRequest({
          method: "POST",
          url: "/api/cart/update",
          data: { cartItems },
        });
        if (!data.success) toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const value = {
    navigate,
    location,
    user,
    setUser,
    setIsSeller,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    logout,
    setShowSellerLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    makeRequest,
    fetchProducts,
    setCartItems,
    fetchSeller,
    loading,
    fileToBase64,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
