import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { Preferences, makeRequest } = useCoreContext();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [wishList, setWishList] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [loading, setLoading] = useState(true);

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
        const storedUser = await Preferences.get({ key: "user" });
        if (storedUser.value) {
          const parsedUser = JSON.parse(storedUser.value);
          setCartItems(parsedUser.cartItems || {});
          setWishList(parsedUser.wishList || []);
        }
        
        await fetchProducts();
      } catch (err) {
      console.error("Error loading initial data:", err);
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

    updateCart();
  }, [cartItems]);

  useEffect(() => {
    const updateWishListDb = async () => {
      try {
        const data = await makeRequest({
          method: "POST",
          url: "/api/user/wishListUpdate",
          data: { wishList },
        });
        if (!data.success) toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      }
    };

    updateWishListDb();
  }, [wishList]);

  const value = {
    products,
    setProducts,
    cartItems,
    setCartItems,
    wishList,
    setWishList,
    searchQuery,
    setSearchQuery,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    updateWishList,
    getCartCount,
    getCartAmount,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
