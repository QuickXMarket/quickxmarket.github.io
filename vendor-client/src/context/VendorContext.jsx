import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";

export const VendorContext = createContext();

export const VendorContextProvider = ({ children }) => {
  const { axios, navigate } = useCoreContext();
  const { user } = useAuthContext();
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [vendor, setVendor] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [revenueGraphData, setRevenueGraphData] = useState([]);
  const [orderGraphData, setOrderGraphData] = useState([]);

  const checkVendorStatus = async () => {
    let retrievedVendor = null;
    try {
      const { data } = await axios.get(`/api/seller/user/${user._id}`);
      if (data.success) {
        setBusinessName(data.vendor.businessName);
        retrievedVendor = data.vendor;
        setVendor(data.vendor);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to verify vendor status");
    } finally {
      return retrievedVendor;
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list/vendor");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchOrders = async (vendor) => {
    try {
      const { data } = await axios.get(`/api/order/seller/${vendor._id}`);
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchWallet = async () => {
    try {
      const { data } = await axios.get(`/api/wallet/vendor`);
      if (data.success) {
        setWallet(data.wallet);
      } else {
        toast.error("Failed to fetch wallet");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getDashBoardStats = async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const totalProducts = products.length;
      const totalOrders = orders.length;

      const todayOrders = orders.filter((order) => {
        const createdAt = new Date(order.createdAt);
        return createdAt >= startOfDay && createdAt <= endOfDay;
      });

      const todayRevenue = todayOrders
        .filter((order) =>
          order.items.every((item) => item.status === "Order Confirmed")
        )
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      const totalRevenue = orders
        .filter((order) =>
          order.items.every((item) => item.status === "Order Confirmed")
        )
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      const recentProducts = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);
      const userActivities = [];

      for (const product of recentProducts) {
        recentActivities.push({
          type: "product",
          title: "New Product",
          id: product._id,
          name: product.name,
          createdAt: product.createdAt,
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

      const allTransactions = wallet?.transactions.map((tx) => ({
        type: "transaction",
        title: "New Transaction",
        id: tx._id,
        userId: wallet.userId,
        createdAt: tx.createdAt,
      }));

      const transactionActivities = allTransactions
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);

      const activities = [
        ...userActivities,
        ...orderActivities,
        ...(transactionActivities || []),
      ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);

      const retrievedStats = {
        totalProducts,
        totalOrders,
        todayOrders: todayOrders.length || 0,
        todayRevenue,
        totalRevenue
      };

      setStats(retrievedStats);
      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard stats");
      setStats({});
      setRecentActivities([]);
    }
  };

  const getGraphData = async () => {
    try {
      const revenueGraphMap = {};
      const orderGraphMap = {};

      orders.forEach((order) => {
        const dateKey = new Date(order.createdAt).toISOString().slice(0, 10);

        if (order.items.every((item) => item.status === "Order Confirmed")) {
          revenueGraphMap[dateKey] =
            (revenueGraphMap[dateKey] || 0) + (order.totalPrice || 0);
        }

        orderGraphMap[dateKey] = (orderGraphMap[dateKey] || 0) + 1;
      });

      const revenueGraphData = Object.entries(revenueGraphMap).map(
        ([date, value]) => ({ date, value })
      );

      const orderGraphData = Object.entries(orderGraphMap).map(
        ([date, count]) => ({ date, count })
      );

      revenueGraphData.sort((a, b) => new Date(a.date) - new Date(b.date));
      orderGraphData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setRevenueGraphData(revenueGraphData);
      setOrderGraphData(orderGraphData);
    } catch (error) {
      console.error("Error fetching graph data:", error);
      toast.error("Failed to fetch graph data");
    }
  };

  const handleOpenToggle = async () => {
    if (!vendor || !user) {
      toast.error("Please login to toggle your status.");
      return;
    }
    try {
      const { data } = await axios.patch("/api/seller/toggle-status");
      if (data.success) {
        toast.success(`You are now ${!vendor.isOpen ? "open" : "closed"}`);
        setVendor((prev) => ({ ...prev, isOpen: !prev.isOpen }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error toggling vendor status:", error);
      toast.error("Failed to toggle vendor status.");
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const vendor = await checkVendorStatus();

        if (vendor && vendor._id) {
          await Promise.all(
            fetchOrders(vendor),
            fetchProducts(),
            fetchWallet()
          );
        }
      } catch (err) {
        // Optional: log or toast error
      } finally {
        setLoading(false);
      }
    };
    if (user && user.isSeller && !vendor) loadInitialData();
  }, [user]);

  useEffect(() => {
    getDashBoardStats();
    getGraphData();
  }, [vendor, products, orders, wallet]);

  const memoizedFetchProducts = useCallback(fetchProducts, [axios]);
  const memoizedFetchOrders = useCallback(fetchOrders, [axios, vendor?._id]);
  const memoizedCheckVendorStatus = useCallback(checkVendorStatus, [
    axios,
    user?._id,
  ]);
  const memoizedHandleOpenToggle = useCallback(handleOpenToggle, [
    axios,
    vendor?.isOpen,
  ]);

  const memoizedVendor = useMemo(
    () => ({
      _id: vendor?._id,
      businessName: vendor?.businessName,
      isOpen: vendor?.isOpen,
      // Only include needed properties
    }),
    [vendor?._id, vendor?.businessName, vendor?.isOpen]
  );

  const memoizedWallet = useMemo(
    () => ({
      balance: wallet?.balance,
      transactions: wallet?.transactions?.slice(0, 10) || [], // Limit transactions
    }),
    [wallet?.balance, wallet?.transactions]
  );

  const memoizedStats = useMemo(
    () => ({
      totalProducts: stats.totalProducts || 0,
      totalOrders: stats.totalOrders || 0,
      todayRevenue: stats.todayRevenue || 0,
      totalRevenue: stats.totalRevenue || 0,
    }),
    [
      stats.totalProducts,
      stats.totalOrders,
      stats.todayRevenue,
      stats.totalRevenue,
    ]
  );

  const value = useMemo(
    () => ({
      showSellerLogin,
      setShowSellerLogin,
      loading,
      vendor: memoizedVendor,
      businessName,
      checkVendorStatus: memoizedCheckVendorStatus,
      setVendor,
      orders,
      products,
      fetchProducts: memoizedFetchProducts,
      fetchOrders: memoizedFetchOrders,
      stats: memoizedStats,
      recentActivities,
      wallet: memoizedWallet,
      setWallet,
      handleOpenToggle: memoizedHandleOpenToggle,
      revenueGraphData,
      orderGraphData,
    }),
    [
      showSellerLogin,
      loading,
      memoizedVendor,
      businessName,
      memoizedCheckVendorStatus,
      orders,
      products,
      memoizedFetchProducts,
      memoizedFetchOrders,
      memoizedStats,
      recentActivities,
      memoizedWallet,
      revenueGraphData,
      orderGraphData,
    ]
  );

  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
};

export const useVendorContext = () => {
  return useContext(VendorContext);
};
