import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { assets } from "../assets/assets";
import { useAdminContext } from "../context/AdminContext";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const UserDetails = () => {
  const { userId } = useParams();
  const { users, riders, vendors, orders, getOrderStatus } = useAdminContext();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (users.length === 0 || !userId) return;
    const currentUser = users.find((user) => user._id === userId);
    if (!currentUser) {
      toast.error("User not Found");
      return;
    }

    if (currentUser.isSeller) {
      const vendorDetails = vendors.find((vendor) => vendor.userId === userId);
      currentUser.vendorId = vendorDetails._id;
    }
    if (currentUser.isRider) {
      const riderDetails = riders.find((rider) => rider.userId === userId);
      currentUser.riderId = riderDetails._id;
    }
    const userOrders = orders.filter((order) => order.userId === userId);
    userOrders.map((order) => {
      order.status = getOrderStatus(order)[1];
    });
    currentUser.orders = userOrders;
    setUser(currentUser);
  }, [userId, users]);

  return (
    <>
      {user && (
        <div className="flex flex-col">
          <div className="flex p-4 @container">
            <div className="flex w-full flex-col gap-4 items-center">
              <div className="flex gap-4 flex-col items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                  style={{
                    backgroundImage: `url(${assets.profile_icon})`,
                  }}
                ></div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
                    {user?.name}
                  </p>
                  <a
                    href={`mailto:${user.email}`}
                    className="text-primary text-base font-normal leading-normal text-center"
                  >
                    {user?.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor ID */}
          {user.isSeller && (
            <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14 justify-between">
              <p className="text-text text-base font-normal leading-normal flex-1 truncate">
                Vendor ID
              </p>
              <div className="shrink-0">
                <Link
                  to={`/vendorDetails/${user.vendorId}`}
                  className="text-primary text-base font-normal leading-normal truncate"
                >
                  {user.vendorId}
                </Link>
              </div>
            </div>
          )}

          {user.isRider && (
            <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14 justify-between">
              <p className="text-text text-base font-normal leading-normal flex-1 truncate">
                Rider ID
              </p>
              <div className="shrink-0">
                <Link
                  to={`/riderDetails/${user.riderId}`}
                  className="text-primary text-base font-normal leading-normal truncate"
                >
                  {user.riderId}
                </Link>
              </div>
            </div>
          )}
          <div className="flex px-4 py-3">
            {user.chatId && (
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Contact Customer</span>
              </button>
            )}

            <div className="flex-1" />

            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-500 text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Send Notification</span>
            </button>
          </div>

          {/* Orders Header */}
          <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Orders
          </h2>

          {/* Orders List */}
          {user.orders.map((order, indx) => (
            <div
              key={indx}
              className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2 justify-between"
            >
              <div className="flex flex-col justify-center">
                <p className="text-text text-base font-medium leading-normal line-clamp-1">
                  Status:{" "}
                  <span
                    className={
                      order.status === "Delivered"
                        ? "text-primary"
                        : order.status === "Cancelled"
                        ? "text-red"
                        : "text-text"
                    }
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-gray-600 text-sm font-normal leading-normal line-clamp-2 ">
                  Order ID:{" "}
                  <Link
                    to={`/orders/details/${order._id}`}
                    className="text-primary"
                  >
                    {order._id}
                  </Link>
                </p>
              </div>
              <div className="shrink-0">
                <p className="text-text text-base font-normal leading-normal">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!user && <Loading />}
    </>
  );
};

export default UserDetails;
