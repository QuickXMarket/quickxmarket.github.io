import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { makeRequest, navigate, Preferences } = useCoreContext();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isRider, setIsRider] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [showRiderLogin, setShowRiderLogin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchUser = async () => {
    const token = (await Preferences.get({ key: "authToken" })).value;
    if (!token) return;

    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/user/is-auth",
      });

      if (data.success) {
        setUser(data.user);
        setIsSeller(data.user.isSeller || data.role === "vendor");
        setIsRider(data.user.isRider || false);
        await Preferences.set({
          key: "user",
          value: JSON.stringify(data.user),
        });
      }
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      const data = await makeRequest({
        url: "/api/user/logout",
        method: "GET",
      });
      if (data.success) {
        toast.success(data.message);
        await Preferences.remove({ key: "user" });
        await Preferences.remove({ key: "authToken" });
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateUser = async (updater) => {
    setUser((prevUser) => {
      Preferences.set({ key: "user", value: JSON.stringify(updater) });
      return updatedUser;
    });
  };

  useEffect(() => {
    const loadInitialUser = async () => {
      try {
        const tokenExpiry = (await Preferences.get({ key: "authTokenExpiry" }))
          .value;

        if (!tokenExpiry || Date.now() >= Number(tokenExpiry)) {
          await Preferences.remove({ key: "authToken" });
          await Preferences.remove({ key: "authTokenExpiry" });
          await Preferences.remove({ key: "user" });
        }
        const storedUser = await Preferences.get({ key: "user" });
        if (storedUser.value) {
          const parsedUser = JSON.parse(storedUser.value);
          setUser(parsedUser);
        }
        await fetchUser();
      } catch (err) {
        // Optional: log or toast error
      } finally {
        setAuthLoading(false);
      }
    };
    loadInitialUser();
  }, []);

  const value = {
    user,
    setUser,
    isSeller,
    setIsSeller,
    isRider,
    setIsRider,
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    setShowSellerLogin,
    showRiderLogin,
    setShowRiderLogin,
    logout,
    fetchUser,
    authLoading,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
