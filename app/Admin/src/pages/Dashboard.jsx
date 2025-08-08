import React, { useState } from "react";
import { Package, User, CreditCard } from "lucide-react";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";
import { useAdminContext } from "../context/AdminContext";

const Dashboard = () => {
  const { admin } = useAuthContext();
  const { stats, recentActivities } = useAdminContext();
  const { getRelativeDayLabel } = useCoreContext();

  return (
    <div className="px-4 pt-5 pb-2 text-text overflow-y-auto">
      {/* Welcome Message */}
      <h3 className="tracking-light text-2xl font-bold leading-tight text-left">
        Welcome back, {admin?.name || "Admin"}!
      </h3>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 py-4">
        <div className="flex gap-x-3">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-card">
            <p className="text-base font-medium leading-normal text-text">
              Total Users
            </p>
            <p className="tracking-light text-2xl font-bold leading-tight text-text">
              {stats?.totalUsers}
            </p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-card">
            <p className="text-base font-medium leading-normal text-text">
              Today Orders
            </p>
            <p className="tracking-light text-2xl font-bold leading-tight text-text">
              {stats?.todayOrders}
            </p>
          </div>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-card">
          <p className="text-base font-medium leading-normal text-text">
            Today Revenue
          </p>
          <p className="tracking-light text-2xl font-bold leading-tight text-text">
            {stats?.todayRevenue?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Activity Header */}
      <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 text-text">
        Recent Activity
      </h2>

      {/* Activity Items */}
      {recentActivities.slice(0, 5).map((activity, idx) => (
        <div
          key={idx}
          className="flex flex-wrap items-center gap-4 px-4 py-2 min-h-[72px] justify-between rounded-md bg-card hover:bg-card-hover transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex items-center justify-center rounded-lg shrink-0 size-12 bg-gray-200 text-text">
              {activity.type === "user" && <User className="w-6 h-6" />}
              {activity.type === "order" && <Package className="w-6 h-6" />}
              {activity.type === "transaction" && (
                <CreditCard className="w-6 h-6" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-medium leading-normal line-clamp-1 text-text">
                {activity.title}
              </p>
              <p className=" w-[70%] text-sm font-normal leading-normal line-clamp-2 text-gray-500 truncate">
                {activity.name || activity.id}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <p className="text-sm font-normal leading-normal text-gray-500">
              {getRelativeDayLabel(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
