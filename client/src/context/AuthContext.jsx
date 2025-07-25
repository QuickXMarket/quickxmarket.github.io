import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { axios } = useCoreContext();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isRider, setIsRider] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Seller Status
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setIsSeller(data.user.isSeller || data.role === "vendor");
        setIsRider(data.user.isRider || false);
      }
    } catch (error) {
      console.log(error);
      setUser(null);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        fetchUser();
      } catch (err) {
        // Optional: log or toast error
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const value = {
    user,
    setUser,
    setIsSeller,
    isSeller,
    isRider,
    setIsRider,
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    setShowSellerLogin,

    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
