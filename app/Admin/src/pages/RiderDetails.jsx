import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { assets } from "../assets/assets";
import { useAdminContext } from "../context/AdminContext";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const RiderDetails = () => {
  const { riderId } = useParams();
  const { riders, orders, getOrderStatus } = useAdminContext();
  const [rider, setRider] = useState(null);

  useEffect(() => {
    if (riders.length === 0 || !riderId || !orders) return;
    const currentRider = riders.find((rider) => rider._id === riderId);
    if (!currentRider) {
      toast.error("Rider was not Found");
      return;
    }

    const riderOrders = currentRider.orders.map((riderOrderId) => {
      const orderDetails = orders.find((order) => order._id === riderOrderId);
      if (!orderDetails) return null;

      return {
        ...orderDetails,
        status: getOrderStatus(orderDetails)[1],
      };
    });

    currentRider.orders = riderOrders;
    setRider(currentRider);
  }, [riderId, riders, orders]);

  return (
    <>
      {rider && (
        <div>
          <div class="flex p-4 @container">
            <div class="flex w-full flex-col gap-4 items-center">
              <div class="flex gap-4 flex-col items-center">
                <div
                  class="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                  style={{
                    backgroundImage: `url(${
                      rider.profilePhoto || assets.profile_icon
                    })`,
                  }}
                ></div>
                <div class="flex flex-col items-center justify-center justify-center">
                  <p class="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
                    {rider.name}
                  </p>
                  <Link
                    to={`tel:${rider.number}`}
                    class="text-primary text-base font-normal leading-normal text-center"
                  >
                    {rider.number}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 grid grid-cols-[30%_1fr] gap-x-6">
            <div class="col-span-2 grid grid-cols-subgrid border-t border-t-[#cedbe8] py-5">
              <p class="text-gray-600 text-sm font-normal leading-normal">
                Date of Birth
              </p>
              <p class="text-text text-sm font-normal leading-normal">
                {new Date(rider.dob).toLocaleDateString()}
              </p>
            </div>
            <div class="col-span-2 grid grid-cols-subgrid border-t border-t-[#cedbe8] py-5">
              <p class="text-gray-600 text-sm font-normal leading-normal">
                Vehicle Type
              </p>
              <p class="text-text text-sm font-normal leading-normal">
                {rider.vehicleType}
              </p>
            </div>
            <div class="col-span-2 grid grid-cols-subgrid border-t border-t-[#cedbe8] py-5">
              <p class="text-gray-600 text-sm font-normal leading-normal">
                User ID
              </p>
              <Link
                to={`/userDetails/${rider.userId}`}
                class="text-primary text-sm font-normal leading-normal truncate"
              >
                {rider.userId}
              </Link>
            </div>
          </div>
          {rider.orders.map(
            (order, indx) =>
              order && (
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
              )
          )}
        </div>
      )}
      {!rider && <Loading />}
    </>
  );
};

export default RiderDetails;
