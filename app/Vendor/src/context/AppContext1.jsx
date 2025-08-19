import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { App as CapacitorApp } from "@capacitor/app";
// import { Http } from "@capacitor-community/http";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { Browser } from "@capacitor/browser";
import { Keyboard } from "@capacitor/keyboard";
import Fuse from "fuse.js";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = "₦";

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isRider, setIsRider] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [showRiderLogin, setShowRiderLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [fuse, setFuse] = useState(null);

  const [cartItems, setCartItems] = useState({});
  const [wishList, setWishList] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [loading, setLoading] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const baseUrl = "http://192.168.0.101:4000";

  const makeRequest = async ({ method, url, data }) => {
    try {
      const token = (await Preferences.get({ key: "authToken" })).value;

      const response = await CapacitorHttp.request({
        method,
        url: `${baseUrl}${url}`,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        data,
      });

      return response.data;
    } catch (err) {
      throw new Error(err?.error || "Network Error");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.write({
        string: text,
      });
      toast.success("Copied to clipboard:", text);
    } catch (err) {
      toast.error("Failed to copy:", err);
    }
  };

  const setupPushNotifications = () => {
    // Request permission on mobile
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        PushNotifications.register();
      } else {
        console.warn("Push permission not granted");
      }
    });

    // On successful registration, get FCM token
    PushNotifications.addListener("registration", async (token) => {
      try {
        await makeRequest({
          method: "PATCH",
          url: "/api/user/update-fcm-token",
          data: {
            userId: user?._id,
            fcmToken: token.value,
          },
        });
        console.log("FCM token saved successfully");
      } catch (error) {
        console.error("Failed to save FCM token:", error.message);
      }
    });

    // If registration fails
    PushNotifications.addListener("registrationError", (error) => {
      console.error("Registration error:", error);
    });

    // Handle received push
    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification) => {
        const route = notification.notification.data?.route;
        await LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || "New Notification",
              body: notification.body || "",
              id: Date.now(),
              ...(route && { extra: { route } }),
            },
          ],
        });
      }
    );

    // Handle user tapping the notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        const route = notification.notification.data?.route;
        if (route) {
          navigate(route);
        }
      }
    );

    LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (event) => {
        const route = event.notification.extra?.route;
        if (route) {
          navigate(route);
        }
      }
    );
  };

  const keyboardListeners = () => {
    Keyboard.addListener("keyboardWillShow", (info) => {
      setKeyboardVisible(true);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });
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

    const setupPaystackCallback = () => {
      CapacitorApp.addListener("appUrlOpen", (event) => {
        const url = event.url;
        const route = url.replace("quickxmarket://", "");

        if (route) {
          navigate("/" + route);
        }
      });
    };

    setupBackHandler();
    setupPaystackCallback();

    const configureStatusBar = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });

        // const isDark =
        //   document.documentElement.classList.contains("dark") ||
        //   window.matchMedia("(prefers-color-scheme: dark)").matches;

        await StatusBar.setStyle({ style: Style.Light });
        await EdgeToEdge.enable();
      } catch (error) {
        console.warn("StatusBar config failed:", error);
      }
    };

    configureStatusBar();

    const requestLocalNotificationPermission = async () => {
      const granted = await LocalNotifications.requestPermissions();
      if (granted.display === "granted") {
        // console.log("Local notification permission granted");
      } else {
        // console.warn("Local notification permission denied");
      }
    };

    requestLocalNotificationPermission();

    return () => {
      if (removeListener) removeListener();
    };
  }, [navigate, location]);

  const fetchUser = async () => {
    const token = (await Preferences.get({ key: "authToken" })).value;
    if (!token) return;

    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/user/is-auth",
      });

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
        setWishList(data.user.wishList || []);
        setIsSeller(data.user.isSeller || data.role === "vendor");
        setIsRider(data.user.isRider || false);
        await Preferences.set({
          key: "user",
          value: JSON.stringify(data.user),
        });
      }
    } catch {
      setUser(null);
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

  const fetchAddresses = async () => {
    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/geocoding/fetchAddresses",
      });
      if (data.success) {
        const fuseIndex = new Fuse(data.data, {
          keys: ["display_name", "street", "city", "country"],
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

  const logout = async () => {
    try {
      const data = await makeRequest({
        url: "/api/user/logout",
        method: "GET",
      });
      if (data.success) {
        toast.success(data.message);
        await Preferences.remove({ key: "user" });
        await Preferences.remove({ key: "authToken" });
        await Preferences.remove({ key: "authTokenExpiry" });
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
        }
        await Promise.all([fetchUser(), fetchProducts(), fetchAddresses()]);
        keyboardListeners();
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

  useEffect(() => {
    const updateWishList = async () => {
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

    if (user) {
      updateWishList();
    }
  }, [wishList]);

  useEffect(() => {
    if (user) {
      if (Capacitor.isNativePlatform()) setupPushNotifications();
    }
  }, [user]);

  const value = {
    navigate,
    location,
    user,
    setUser,
    setIsSeller,
    isSeller,
    setIsRider,
    isRider,
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    logout,
    setShowSellerLogin,
    showRiderLogin,
    setShowRiderLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    updateWishList,
    wishList,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    makeRequest,
    fetchProducts,
    setCartItems,
    setWishList,
    loading,
    Preferences,
    fileToBase64,
    fuse,
    Browser,
    keyboardVisible,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
