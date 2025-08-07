import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Fuse from "fuse.js";

const baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseURL;

export const CoreContext = createContext();

export const CoreContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const [fuse, setFuse] = useState(null);

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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchAddresses();
      } catch (err) {
        // Optional: log or toast error
      }
    };

    loadInitialData();
  }, []);

  const value = useMemo(
    () => ({
      navigate,
      location,
      currency,
      axios,
      fuse,
      baseURL,
      getRelativeDayLabel,
    }),
    [navigate, location, currency, fuse, baseURL, getRelativeDayLabel]
  );

  return <CoreContext.Provider value={value}>{children}</CoreContext.Provider>;
};

export const useCoreContext = () => {
  return useContext(CoreContext);
};
