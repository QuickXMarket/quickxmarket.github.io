import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { axios, navigate } = useCoreContext();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [vendor, setVendor] = useState("");

  // Fetch Seller Status
  const fetchUser = async () => {
    let user = null;
    try {
      const { data } = await axios.get("api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        user = data.user;
        setIsSeller(data.user.isSeller || data.role === "vendor");
      }
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      return user;
    }
  };

  const checkVendorStatus = async (user) => {
    try {
      const { data } = await axios.get(`/api/seller/user/${user._id}`);
      if (data.success) {
        setBusinessName(data.vendor.businessName);
        console.log(data.vendor);
        setVendor(data.vendor);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to verify vendor status");
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
        const fetchedUser = await fetchUser();
        if (fetchedUser) await checkVendorStatus(fetchedUser);
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
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    setShowSellerLogin,
    logout,
    loading,
    vendor,
    businessName,
    checkVendorStatus,
    setVendor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
