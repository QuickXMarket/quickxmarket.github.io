import { createContext, useContext, useEffect, useState } from "react";
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

  const value = {
    navigate,
    location,
    currency,
    axios,
    fuse,
    baseURL,
  };

  return <CoreContext.Provider value={value}>{children}</CoreContext.Provider>;
};

export const useCoreContext = () => {
  return useContext(CoreContext);
};
