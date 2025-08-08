import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { assets } from "../assets/assets";
import { useAdminContext } from "../context/AdminContext";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const VendorDetails = () => {
  const { vendorId } = useParams();
  const { vendors, orders, getOrderStatus } = useAdminContext();

  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    if (vendors.length === 0 || !vendorId) return;
    const currentVendor = vendors.find((vendor) => vendor._id === vendorId);
    if (!currentVendor) {
      toast.error("Vendor was not Found");
      return;
    }

    const vendorOrders = currentVendor.orders.map((vendorOrderId) => {
      const orderDetails = orders.find((order) => order._id === vendorOrderId);
      if (!orderDetails) return null;

      return {
        ...orderDetails,
        status: getOrderStatus(orderDetails)[1],
      };
    });

    currentVendor.orders = vendorOrders;
    setVendor(currentVendor);
  }, [vendorId, vendors, orders]);

  return (
    <div>
      {vendor && (
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-slate-50 @[480px]:rounded-lg min-h-[218px]"
              style={{
                backgroundImage: `url(${vendor.profilePhoto})`,
              }}
            />
          </div>

          <h1 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
            {vendor.businessName}
          </h1>

          <Link
            to={`tel:${vendor.number}`}
            className="text-primary text-base font-normal leading-normal pb-3 pt-1 px-4"
          >
            {vendor.number}
          </Link>

          <p className="text-text text-base font-normal leading-normal pb-3 pt-1 px-4">
            {vendor.address}
          </p>

          <div class="p-4 grid grid-cols-[30%_1fr] gap-x-6">
            <div class="col-span-2 grid grid-cols-subgrid border-t border-t-gray-700 py-5">
              <p class="text-gray-600 text-sm font-normal leading-normal">
                Business Hours
              </p>
              <p class="text-text text-sm font-normal leading-normal">
                {vendor.openingTime}-{vendor.closingTime}
              </p>
            </div>
            <div class="col-span-2 grid grid-cols-subgrid border-t border-t-gray-700 py-5">
              <p class="text-gray-600 text-sm font-normal leading-normal">
                User ID
              </p>
              <Link
                to={`/userDetails/${vendor.userId}`}
                class=" text-sm font-normal leading-normal text-primary"
              >
                {vendor.userId}
              </Link>
            </div>
          </div>
          <div className="flex px-4 py-3">
            {vendor.chatId && (
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
          {vendor.orders.map(
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
      {!vendor && <Loading />}
    </div>
  );
};

export default VendorDetails;
