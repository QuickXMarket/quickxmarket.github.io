import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { makeRequest, navigate, secureRemove, secureSet, secureGet } =
    useCoreContext();
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchAdmin = async () => {
    const token = await secureGet("authToken");
    if (!token) return;

    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/admin/is-auth",
      });

      if (data.success) {
        setAdmin(data.admin);
        await secureSet("admin", JSON.stringify(data.admin));
      }
    } catch {
      setAdmin(null);
    }
  };

  const logout = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/logout",
        method: "GET",
      });
      if (data.success) {
        toast.success(data.message);
        await secureRemove("authToken");
        await secureRemove("authTokenExpiry");
        await secureRemove("admin");
        setAdmin(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateUser = async (updater) => {
    setAdmin((prevUser) => {
      const updatedUser =
        typeof updater === "function" ? updater(prevUser) : updater;
      secureSet("admin", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  useEffect(() => {
    const loadInitialUser = async () => {
      try {
        const tokenExpiry = await secureGet("authTokenExpiry");
        
        if (!tokenExpiry || Date.now() >= Number(tokenExpiry)) {
          await secureRemove("authToken");
          await secureRemove("authTokenExpiry");
          await secureRemove("admin");
        }
        const storedUser = await secureGet("authToken");
        if (storedUser) {
          setLoggedIn(true);
        }
      } catch (err) {
        // Optional: log or toast error
      } finally {
        setAuthLoading(false);
      }
    };
    loadInitialUser();
  }, []);

  const value = {
    admin,
    setAdmin,
    logout,
    fetchAdmin,
    authLoading,
    updateUser,
    loggedIn,
    setLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
