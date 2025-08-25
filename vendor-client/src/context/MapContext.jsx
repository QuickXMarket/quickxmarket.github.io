import { createContext, useContext, useEffect, useState } from "react";
import { useCoreContext } from "./CoreContext";

export const MapContext = createContext();

export const MapContextProvider = ({ children }) => {
  const { axios } = useCoreContext();
  const [loading, setLoading] = useState(true);
  const [mapCache, setMapCache] = useState(new Map());

  const getAddressSuggestions = async (input) => {
    if (!input || input.trim().length < 3) return;

    if (mapCache.has(input)) {
      return mapCache.get(input);
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/map/autoComplete?input=${input}`);
      if (data) {
        setMapCache((prev) => {
          const newCache = new Map(prev);
          newCache.set(input, data);
          return newCache;
        });
        return data;
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    getAddressSuggestions,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = () => {
  return useContext(MapContext);
};
