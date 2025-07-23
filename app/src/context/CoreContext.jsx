import { createContext, useContext, useState, useEffect } from "react";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { Browser } from "@capacitor/browser";
import Fuse from "fuse.js";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useLocation, useNavigate } from "react-router";
import { Preferences } from "@capacitor/preferences";

const CoreContext = createContext();

export const CoreProvider = ({ children }) => {
  const currency = "₦";
  const [fuse, setFuse] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const keyboardListeners = () => {
    Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });
  };

  useEffect(() => {
    const configureStatusBar = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        await fetchAddresses();
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Light });
        await EdgeToEdge.enable();
      } catch (error) {
        console.warn("StatusBar config failed:", error);
      }
    };

    configureStatusBar();
    keyboardListeners();
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
  };

  return <CoreContext.Provider value={value}>{children}</CoreContext.Provider>;
};

export const useCoreContext = () => {
  return useContext(CoreContext);
};
