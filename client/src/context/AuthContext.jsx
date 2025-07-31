import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { axios, navigate } = useCoreContext();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isRider, setIsRider] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [showRiderLogin, setShowRiderLogin] = useState(false);
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

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        window.google.accounts.id.disableAutoSelect();
        toast.success(data.message);
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
    showRiderLogin,
    setShowRiderLogin,
    showSellerLogin,
    setShowSellerLogin,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
