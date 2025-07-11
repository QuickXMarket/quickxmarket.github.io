import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Fuse from "fuse.js";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isRider, setIsRider] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [wishList, setWishList] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});
  const [loading, setLoading] = useState(true);
  const [fuse, setFuse] = useState(null);

  // Fetch Seller Status
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        setWishList(data.user.wishList || []);
        setIsSeller(data.user.isSeller || data.role === "vendor");
        setIsRider(data.user.isRider || false);
      }
    } catch {
      setUser(null);
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

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get("/api/geocoding/fetchAddresses");
      if (data.success) {
        const fuseIndex = new Fuse(data.data, {
          keys: ["display_name", "city", "country"],
          threshold: 0.3,
          includeScore: false,
          ignoreLocation: true,
          findAllMatches: true,
        });
        setFuse(fuseIndex);
      }
    } catch (error) {
      toast.error("Failed to fetch addresses: " + error.message);
      return [];
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

  const updateWishList = (itemId) => {
    let wishListData = structuredClone(wishList);
    if (wishListData.includes(itemId)) {
      wishListData = wishListData.filter((item) => item !== itemId);
      toast.success("Removed from Wish List");
    } else {
      wishListData.push(itemId);
      toast.success("Added to Wish List");
    }
    setWishList(wishListData);
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
        await Promise.all([fetchUser(), fetchProducts(), fetchAddresses()]);
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

  useEffect(() => {
    const updateWishList = async () => {
      try {
        const { data } = await axios.post("/api/user/wishListUpdate", {
          wishList,
        });
        if (!data.success) toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (user) {
      updateWishList();
    }
  }, [wishList]);

  const value = {
    navigate,
    location,
    user,
    setUser,
    setIsSeller,
    isSeller,
    isRider,
    setIsRider,
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    setShowSellerLogin,
    updateWishList,
    wishList,
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
    setWishList,

    loading,
    fuse,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
