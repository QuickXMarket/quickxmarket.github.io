import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { Keyboard } from "@capacitor/keyboard";
import { Browser } from "@capacitor/browser";
import { InAppBrowser, DefaultWebViewOptions } from "@capacitor/inappbrowser";
import Fuse from "fuse.js";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { Preferences } from "@capacitor/preferences";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useLocation, useNavigate } from "react-router";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { NativeBiometric } from "capacitor-native-biometric";
import toast from "react-hot-toast";
import SHA256 from "crypto-js/sha256";

const CoreContext = createContext();

export const CoreProvider = ({ children }) => {
  const currency = "₦";
  const [fuse, setFuse] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(null);

  const baseUrl = "http://192.168.0.102:4000";

  const makeRequest = async ({ method, url, data }) => {
    try {
      const tokenExpiry = await secureGet("authTokenExpiry");

      if (!tokenExpiry || Date.now() >= Number(tokenExpiry)) {
        secureRemove("authToken");
        secureRemove("authTokenExpiry");
        secureRemove("admin");
      }

      const token = await secureGet("authToken");
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

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchAddresses = async () => {
    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/geocoding/fetchAddresses",
      });
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

  const setupDeepLinkListener = async () => {
    CapacitorApp.addListener("appUrlOpen", async (event) => {
      if (!event?.url) return;
      const url = new URL(event.url);

      if (url?.href?.startsWith("quickxmarket-admin://")) {
        await Browser.close();
        const route = url.href.replace("quickxmarket-admin://", "");
        navigate("/" + route);
      }
    });
  };

  const getRelativeDayLabel = (timestamp) => {
    const now = new Date();
    const inputDate = new Date(timestamp);

    const diffMs = now - inputDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffDays === 0) {
      if (diffHrs >= 1) return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
      if (diffMin >= 1) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
      return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
    }

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;

    return inputDate.toLocaleDateString();
  };

  const secureSet = async (key, value) => {
    try {
      await SecureStoragePlugin.set({ key, value });
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  };

  const secureGet = async (key) => {
    try {
      const keysResult = await SecureStoragePlugin.keys();
      const keys = keysResult.value || [];

      if (keys.includes(key)) {
        const result = await SecureStoragePlugin.get({ key });
        return result.value;
      } else {
        console.warn(`Key "${key}" not found in secure storage.`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  };

  const secureRemove = async (key) => {
    try {
      const keysResult = await SecureStoragePlugin.keys();
      const keys = keysResult.value || [];

      if (keys.includes(key)) await SecureStoragePlugin.remove({ key });
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  };

  const keyboardListeners = () => {
    Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });
  };

  const hash = async (str) => {
    return SHA256(str).toString();
  };

  const configureStatusBar = async (theme) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await StatusBar.setOverlaysWebView({ overlay: false });

      if (theme === "dark") {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#1e1e1e" });
      } else {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: "#ffffff" });
      }

      await EdgeToEdge.enable();
    } catch (error) {
      console.warn("StatusBar config failed:", error);
    }
  };

  const authenticateWithBiometrics = async (onVerified) => {
    try {
      const result = await NativeBiometric.verifyIdentity({
        reason: "Authenticate to access admin panel",
        title: "Biometric Login",
        subtitle: "Use fingerprint or face unlock",
        description: "We use this to verify your identity",
      })
        .then(() => onVerified())
        .catch((error) => {
          console.log(error);
          toast.error("Biometric authentication failed");
        });
    } catch (err) {
      toast.error("Biometric authentication error");
      console.error(err);
    }
  };

  const tryBiometrics = async (onVerified) => {
    try {
      const { isAvailable } = await NativeBiometric.isAvailable();
      if (isAvailable) {
        await authenticateWithBiometrics(onVerified);
      } else {
        toast.error("Biometric authentication not available");
      }
    } catch (err) {
      toast.error("Error checking biometric availability");
      console.error(err);
    }
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

    return () => {
      if (removeListener) removeListener();
    };
  }, [location]);

  const toggleTheme = async () => {
    const isDark = document.body.classList.toggle("dark");
    await Preferences.set({ key: "theme", value: isDark ? "dark" : "light" });
    await applySavedTheme();
  };

  const applySavedTheme = async () => {
    const { value } = await Preferences.get({ key: "theme" });
    let savedTheme = value;

    if (!savedTheme || savedTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      savedTheme = prefersDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
    await configureStatusBar(savedTheme);
  };

  useEffect(() => {
    const initialConfig = async () => {
      await applySavedTheme();
      setupDeepLinkListener();
      keyboardListeners();
      // paystackAppResume();
      // await fetchAddresses();
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = async () => {
      await applySavedTheme();
    };

    media.addEventListener("change", handleChange);
    initialConfig();
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({
      currency,
      makeRequest,
      fileToBase64,
      fuse,
      setFuse,
      keyboardVisible,
      Browser,
      navigate,
      location,
      secureSet,
      secureGet,
      secureRemove,
      SecureStoragePlugin,
      baseUrl,
      InAppBrowser,
      DefaultWebViewOptions,
      theme,
      toggleTheme,
      hash,
      getRelativeDayLabel,
      tryBiometrics,
    }),
    [fuse, keyboardVisible, navigate, location, theme]
  );

  return <CoreContext.Provider value={value}>{children}</CoreContext.Provider>;
};

export const useCoreContext = () => {
  return useContext(CoreContext);
};
