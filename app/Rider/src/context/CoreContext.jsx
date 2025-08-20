import { createContext, useContext, useState, useEffect } from "react";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { Keyboard } from "@capacitor/keyboard";
import { Browser } from "@capacitor/browser";
import { InAppBrowser, DefaultWebViewOptions } from "@capacitor/inappbrowser";
import Fuse from "fuse.js";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useLocation, useNavigate } from "react-router";
import { Preferences } from "@capacitor/preferences";
import toast from "react-hot-toast";

const CoreContext = createContext();

export const CoreProvider = ({ children }) => {
  const currency = "₦";
  const [fuse, setFuse] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(null);

  const baseUrl = "http://192.168.0.101:4000";

  const makeRequest = async ({ method, url, data }) => {
    try {
      const tokenExpiry = await Preferences.get({ key: "authTokenExpiry" });

      if (!tokenExpiry || Date.now() >= Number(tokenExpiry)) {
        await Preferences.remove({ key: "authToken" });
        await Preferences.remove({ key: "authTokenExpiry" });
        await Preferences.remove({ key: "user" });
      }
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

  const paystackAppResume = async () => {
    CapacitorApp.addListener("resume", async () => {
      const reference = (await Preferences.get({ key: "reference" })).value;
      toast.success(reference);
      if (reference) {
        try {
          const data = await makeRequest({
            method: "GET",
            url: `/api/payment/verify/${reference}`,
          });

          if (data.received) {
            if (url?.href?.startsWith("quickxmarket://")) {
              await Preferences.remove({ key: "reference" });
              const route = url.href.replace("quickxmarket://", "");
              navigate("/" + route);
            }
          } else {
            console.warn("Transaction not received.");
          }
        } catch (err) {
          console.error("Error verifying transaction", err);
        }
      }
    });
  };

  const setupDeepLinkListener = async () => {
    CapacitorApp.addListener("appUrlOpen", async (event) => {
      if (!event?.url) return;
      const url = new URL(event.url);

      if (url?.href?.startsWith("quickxmarket://")) {
        await Browser.close();
        const route = url.href.replace("quickxmarket://", "");
        navigate("/" + route);
      }
    });
  };

  const keyboardListeners = () => {
    Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });
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
      await fetchAddresses();
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = async () => {
      await applySavedTheme();
    };

    media.addEventListener("change", handleChange);
    initialConfig();
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const value = {
    currency,
    makeRequest,
    fileToBase64,
    fuse,
    setFuse,
    keyboardVisible,
    Browser,
    navigate,
    location,
    Preferences,
    baseUrl,
    InAppBrowser,
    DefaultWebViewOptions,
    theme,
    toggleTheme,
  };

  return <CoreContext.Provider value={value}>{children}</CoreContext.Provider>;
};

export const useCoreContext = () => {
  return useContext(CoreContext);
};
