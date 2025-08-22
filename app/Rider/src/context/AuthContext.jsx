import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";
import { SocialLogin } from "@capgo/capacitor-social-login";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { makeRequest, navigate, Preferences } = useCoreContext();
  const [user, setUser] = useState(null);
  const [isRider, setIsRider] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [rider, setRider] = useState(null);

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

  const verifyRider = async () => {
    try {
      const data = await makeRequest({
        url: `/api/rider/user/`,
        method: "GET",
      });

      if (data.success) {
        setRider(data.rider);
        setIsRider(true);
      } else {
        toast.error("Not a valid rider account");
      }
    } catch (error) {
      toast.error("Failed to verify rider");
      console.log(error);
    } finally {
      setAuthLoading(false);
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
        setRider(null);
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
        await fetchUser();
      } catch (err) {
        // Optional: log or toast error
      } finally {
        setAuthLoading(false);
      }
    };
    loadInitialUser();
  }, []);

  useEffect(() => {
    if (user && user.isRider) {
      setAuthLoading(true);
      verifyRider();
    }
  }, [user]);

  const value = {
    user,
    setUser,
    isRider,
    setIsRider,
    rider,
    logout,
    fetchUser,
    authLoading,
    updateUser,
    SocialLogin,
    verifyRider,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
