import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";

export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const { axios } = useCoreContext();
  const [products, setProducts] = useState([]);

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

  const value = {
    products,
    fetchProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
