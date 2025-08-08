import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";
import { Search } from "lucide-react";
import { useAdminContext } from "../context/AdminContext";

const Orders = () => {
  const { navigate } = useCoreContext();
  const { orders, getOrderStatus } = useAdminContext();
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orders);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = orders.filter((order) => {
        const orderName = `${order.address.firstName} ${order.address.lastName}`;
        return (
          orderName.toLowerCase().includes(lowerCaseQuery) ||
          order.address.email.toLowerCase().includes(lowerCaseQuery) ||
          order.address.phone.toLowerCase().includes(lowerCaseQuery) ||
          order._id.toLowerCase().includes(lowerCaseQuery)
        );
      });
      setFilteredOrders(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const filterOrdersByStatus = (status) => {
    if (status === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const orderStatus = getOrderStatus(order).join(" ");
        return status === orderStatus;
      });
      setFilteredOrders(filtered);
    }
  };

  const filterOrdersByDate = (date) => {
    if (date === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        return date === orderDate;
      });
      setFilteredOrders(filtered);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card">
            <div className="text-primary flex items-center justify-center pl-4 rounded-l-lg bg-card border-r border-border">
              <Search className="w-5 h-5" />
            </div>
            <input
              placeholder="Search orders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex-1 bg-card text-text placeholder:text-gray-500 focus:outline-none focus:ring-0 border-none px-4 rounded-r-lg text-base"
            />
          </div>
        </label>

        <div className="flex gap-3 p-3 overflow-x-hidden">
          {/* Status Dropdown */}
          <div className="relative w-auto">
            <select
              onChange={(e) => filterOrdersByStatus(e.target.value)}
              className=" flex h-8 items-center gap-x-2 rounded-lg bg-gray-200 pl-2 pr-6 text-text text-sm font-medium leading-normal appearance-none"
              defaultValue=""
            >
              <option value="">Status</option>
              <option value="Order Confirmed">Order Confirmed</option>
              <option value="Order Assigned">Order Assigned</option>
              <option value="Order Picked">Order Picked</option>
              <option value="Order Delivered">Order Delivered</option>
              <option value="Order Cancelled">Order Cancelled</option>
            </select>
            <div className="pointer-events-none absolute right-2 top-1.5 text-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </div>
          </div>

          {/* Date Picker */}

          <input
            type="date"
            onChange={(e) => filterOrdersByDate(e.target.value)}
            placeholder="Date"
            className="flex h-8 items-center rounded-lg bg-gray-200 px-4 text-text text-sm font-medium leading-normal"
          />
        </div>

        {filteredOrders.map((order, index) => (
          <div
            key={index}
            onClick={() => navigate(`/orders/details/${order._id}`)}
            className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2 justify-between"
          >
            <div className="flex flex-col justify-center flex-1 w-[75%]">
              <p className="text-text text-base font-medium leading-normal line-clamp-1">
                {`Customer: ${order.address.firstName} ${order.address.lastName}`}
              </p>
              <p className="text-gray-600 text-sm font-normal leading-normal line-clamp-2 w-[70%] truncate">
                Order ID: #{order._id}
              </p>
            </div>
            <div className="shrink-0">
              <p
                className={`${
                  getOrderStatus(order)[1] === "Delivered"
                    ? "text-primary"
                    : getOrderStatus(order)[1] === "Cancelled"
                    ? "text-red"
                    : "text-text"
                } text-base font-normal leading-normal`}
              >
                {getOrderStatus(order)[1]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
