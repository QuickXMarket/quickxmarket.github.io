import React from "react";
import { Package, ShoppingBasket, CreditCard } from "lucide-react";
import { useCoreContext } from "../context/CoreContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useVendorContext } from "../context/VendorContext";

const Dashboard = () => {
  const {
    stats,
    recentActivities,
    orderGraphData,
    revenueGraphData,
    businessName,
  } = useVendorContext();
  const { getRelativeDayLabel, currency } = useCoreContext();

  return (
    <div className="px-4 md:px-8 pt-6 pb-4 text-text no-scrollbar flex-1 h-[92vh] overflow-y-scroll  w-full max-w-screen-xl mx-auto">
      {/* Welcome Message */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Welcome back, {businessName || "Vendor"}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Products</p>
          <p className="text-2xl font-bold">{stats?.totalProducts}</p>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{stats?.totalOrders}</p>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
          <p className="text-2xl font-bold">
            {`${currency}${stats?.todayRevenue?.toLocaleString() || "0"}`}
          </p>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">
            {`${currency}${stats?.totalRevenue?.toLocaleString() || "0"}`}
          </p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Orders (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={orderGraphData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueGraphData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4CAF50"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}

      {recentActivities.length > 0 && (
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      )}
      <div className="space-y-3">
        {recentActivities.slice(0, 6).map((activity, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-card-hover transition cursor-pointer"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center justify-center rounded-lg shrink-0 size-12 bg-[var(--color-gray-200)] text-text">
                {activity.type === "product" && (
                  <ShoppingBasket className="w-6 h-6" />
                )}
                {activity.type === "order" && <Package className="w-6 h-6" />}
                {activity.type === "transaction" && (
                  <CreditCard className="w-6 h-6" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-base font-medium truncate text-text">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {activity.name || activity.id}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-sm text-gray-400">
              {getRelativeDayLabel(activity.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
