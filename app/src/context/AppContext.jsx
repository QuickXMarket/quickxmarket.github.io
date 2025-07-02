import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { App as CapacitorApp } from "@capacitor/app";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://quickxmarket-server.vercel.app/";

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

  useEffect(() => {
    const backHandler = CapacitorApp.addListener("backButton", () => {
      const currentPath = location.pathname;

      // Define what pages should cause the app to exit
      const exitPaths = ["/", "/home"];

      if (exitPaths.includes(currentPath)) {
        CapacitorApp.exitApp();
      } else {
        navigate(-1); // Go back
      }
    });

    return () => {
      backHandler.remove();
    };
  }, [navigate, location]);

  // Fetch Seller Status
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch {
      setUser(null);
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      setIsSeller(data.success && data.user.role === "vendor");
    } catch {
      setIsSeller(false);
    }
  };

  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
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
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
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
    axios,
    fetchProducts,
    setCartItems,
    fetchSeller,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
