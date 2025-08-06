import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { makeRequest, navigate, secureRemove, secureSet, secureGet } =
    useCoreContext();
  const { admin } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/orders",
        method: "GET",
      });
      if (data.success) {
        setOrders(data.data);
        return data.data;
      } else {
        toast.error(data.message || "Failed to fetch orders");
        setOrders([]);
        return [];
      }
    } catch (error) {
      toast.error("Error fetching orders: " + error.message);
      setOrders([]);
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/users",
        method: "GET",
      });
      if (data.success) {
        setUsers(data.data);
        return data.data;
      } else {
        toast.error(data.message || "Failed to fetch users");
        console.error("Failed to fetch users:", data);
        setUsers([]);
        return [];
      }
    } catch (error) {
      toast.error("Error fetching users: " + error.message);
      setUsers([]);
      return [];
    }
  };

  const getDashBoardStats = async (users, orders, wallets = []) => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const totalUsers = users.length;
      const totalOrders = orders.length;

      const todayOrders = orders.filter((order) => {
        const createdAt = new Date(order.createdAt);
        return createdAt >= startOfDay && createdAt <= endOfDay;
      });

      const todayRevenue = todayOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);
      const userActivities = [];
      for (const user of recentUsers) {
        recentActivities.push({
          type: "user",
          title: "New User",
          id: user._id,
          name: user.name,
          createdAt: user.createdAt,
        });
      }

      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);

      const orderActivities = recentOrders.map((order) => ({
        type: "order",
        title: "New Order",
        id: order._id,
        createdAt: order.createdAt,
      }));

      const allTransactions = wallets.flatMap((wallet) =>
        wallet.transactions.map((tx) => ({
          type: "transaction",
          title: "New Transaction",
          id: tx._id,
          userId: wallet.userId,
          createdAt: tx.createdAt,
        }))
      );

      const transactionActivities = allTransactions
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);

      const activities = [
        ...userActivities,
        ...orderActivities,
        ...transactionActivities,
      ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);

      setStats({
        totalUsers,
        totalOrders,
        todayOrders: todayOrders.length,
        todayRevenue,
        totalRevenue,
      });
      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard stats");
      setStats({});
      setRecentActivities([]);
    }
  };

  useEffect(() => {
    if (!admin) return;
    const loadInitialData = async () => {
      try {
        const [orders, users] = await Promise.all([
          fetchOrders(),
          fetchUsers(),
        ]);
        await getDashBoardStats(users, orders);
      } catch (err) {
        // Optional: log or toast error
      } finally {
        setDataLoading(false);
      }
    };
    loadInitialData();
  }, [admin]);

  const value = {
    admin,
    orders,
    users,
    fetchOrders,
    setOrders,
    setUsers,
    dataLoading,
    fetchUsers,
    getDashBoardStats,
    stats,
    recentActivities,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};
