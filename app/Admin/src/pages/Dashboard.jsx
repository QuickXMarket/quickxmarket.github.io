import React, { useState } from "react";
import { Package, User, CreditCard } from "lucide-react";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { admin } = useAuthContext();
  const { navigate } = useCoreContext();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  return (
    <div className="px-4 pt-5 pb-2 text-text overflow-y-auto">
      {/* Welcome Message */}
      <h3 className="tracking-light text-2xl font-bold leading-tight text-left">
        Welcome back, {admin?.name || "Admin"}!
      </h3>

      {/* Stats Cards */}
      {/* <div className="flex flex-wrap gap-4 py-4">
        <div className="flex gap-x-3">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-card">
            <p className="text-base font-medium leading-normal text-text">
              {stats[0].label}
            </p>
            <p className="tracking-light text-2xl font-bold leading-tight text-text">
              {stats[0].value}
            </p>
          </div>{" "}
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-card">
            <p className="text-base font-medium leading-normal text-text">
              {stats[1].label}
            </p>
            <p className="tracking-light text-2xl font-bold leading-tight text-text">
              {stats[1].value}
            </p>
          </div>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-card">
          <p className="text-base font-medium leading-normal text-text">
            {stats[2].label}
          </p>
          <p className="tracking-light text-2xl font-bold leading-tight text-text">
            {stats[2].value}
          </p>
        </div>
      </div> */}

      {/* Recent Activity Header */}
      <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 text-text">
        Recent Activity
      </h2>

      {/* Activity Items */}
      {recentActivities.map((activity, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 px-4 py-2 min-h-[72px] justify-between rounded-md bg-card hover:bg-card-hover transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg shrink-0 size-12 bg-[var(--color-gray-200)] text-text">
              <activity.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-medium leading-normal line-clamp-1 text-text">
                {activity.title}
              </p>
              <p className="text-sm font-normal leading-normal line-clamp-2 text-[var(--color-gray-500)]">
                {activity.subtitle}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <p className="text-sm font-normal leading-normal text-[var(--color-gray-500)]">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
