import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";
import { SocialLogin } from "@capgo/capacitor-social-login";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { makeRequest, navigate, Preferences } = useCoreContext();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [vendor, setVendor] = useState("");

  const checkVendorStatus = async (user) => {
    if (!user || !user.isSeller) {
      return;
    }
    try {
      const data = await makeRequest({
        url: `/api/seller/user/${user._id}`,
        method: "GET",
      });
      if (data.success) {
        setBusinessName(data.vendor.businessName);
        setVendor(data.vendor);
      } else {
        toast.error("Failed to verify vendor status");
      }
    } catch (error) {
      toast.error("Failed to verify vendor status");
      setIsVendor(false);
    }
  };

  const fetchUser = async () => {
    const token = (await Preferences.get({ key: "authToken" })).value;
    if (!token) return;
    let user = null;

    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/user/is-auth",
      });

      if (data.success) {
        setUser(data.user);
        setIsSeller(data.user.isSeller || data.role === "vendor");
        await Preferences.set({
          key: "user",
          value: JSON.stringify(data.user),
        });
        user = data.user;
      }
    } catch {
      setUser(null);
    }
    return user;
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
      const updatedUser =
        typeof updater === "function" ? updater(prevUser) : updater;
      Preferences.set({ key: "user", value: JSON.stringify(updatedUser) });
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
        let fetchedUser = await fetchUser();
        if (fetchedUser) await checkVendorStatus(fetchedUser);
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
    logout,
    fetchUser,
    authLoading,
    updateUser,
    SocialLogin,
    businessName,
    vendor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
