import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";

export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const { axios } = useCoreContext();
  const { user } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

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
  const addToCart = (productId, optionId) => {
    const cartData = structuredClone(cartItems);

    if (!cartData[productId]) {
      cartData[productId] = {};
    }

    if (cartData[productId][optionId]) {
      cartData[productId][optionId] += 1;
    } else {
      cartData[productId][optionId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  // Update Cart Item Quantity
  const updateCartItem = (productId, optionId, quantity) => {
    const cartData = structuredClone(cartItems);
    if (!cartData[productId]) return;

    cartData[productId][optionId] = quantity;
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
  const removeFromCart = (productId, optionId) => {
    const cartData = structuredClone(cartItems);
    if (!cartData[productId] || !cartData[productId][optionId]) return;

    cartData[productId][optionId] -= 1;
    if (cartData[productId][optionId] <= 0) {
      delete cartData[productId][optionId];
      if (Object.keys(cartData[productId]).length === 0) {
        delete cartData[productId];
      }
    }

    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  // Get Cart Item Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const productId in cartItems) {
      for (const optionId in cartItems[productId]) {
        totalCount += cartItems[productId][optionId];
      }
    }
    return totalCount;
  };

  // Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const optionId in cartItems[productId]) {
        const option = product.options?.find((o) => o._id === optionId);
        if (option) {
          const offerPrice = option.offerPrice || option.price;
          totalAmount += offerPrice * cartItems[productId][optionId];
        }
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    if (user) {
      setCartItems(user.cartItems || {});
      setWishList(user.wishList || []);
    }
  }, [user]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        fetchProducts();
      } catch (err) {
        // Optional: log or toast error
      } finally {
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
    updateWishList,
    wishList,
    products,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    fetchProducts,
    setCartItems,
    setWishList,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
