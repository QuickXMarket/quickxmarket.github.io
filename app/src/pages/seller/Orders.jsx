import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import { useCoreContext } from "../../context/CoreContext";

const Orders = () => {
  const { currency, makeRequest } = useCoreContext();
  const [orders, setOrders] = useState([]);
  const { vendor } = useOutletContext();
  const [activeIndex, setActiveIndex] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await makeRequest({
        url: `/api/order/seller/${vendor._id}`,
        method: "GET",
      });
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (vendor && vendor._id) fetchOrders();
  }, [vendor]);

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      const data = await makeRequest({
        url: "/api/order/update-status",
        method: "PATCH",
        data: {
          orderId,
          status,
          vendorId: vendor._id,
        },
      });
      if (data.success) {
        toast.success("Order status updated successfully");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActiveIndex(null);
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="rounded-md border border-gray-300 overflow-hidden"
          >
            {/* Accordion Header */}
            <div
              onClick={() => toggleAccordion(index)}
              className="flex items-center justify-between  bg-gray-50 px-4 py-3 active:bg-gray-100 cursor-pointer"
            >
              <div className="flex gap-3 items-center">
                <img
                  className="w-8 h-8 object-cover"
                  src={assets.box_icon}
                  alt="boxIcon"
                />
                <div>
                  <p className="font-medium text-sm">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.paymentType} •{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold">
                  {currency}
                  {order.amount}
                </p>
                <p
                  className={`text-xs ${
                    order.isPaid ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </p>
              </div>
            </div>

            {/* Accordion Body */}
            {activeIndex === index && (
              <div className="bg-background px-4 py-3 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Items</h3>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-sm flex justify-between py-1 border-b border-gray-200"
                    >
                      <p>{item.product.name}</p>
                      <p>x{item.quantity}</p>
                      <p className="text-primary font-semibold">
                        {currency}
                        {item.product.offerPrice * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Shipping Info</h3>
                  <p className="text-sm text-text">
                    {order.address.address}, {order.address.phone}
                  </p>
                </div>
                {order.items.every(
                  (item) => item.status === "Order Placed"
                ) && (
                  <div className="flex gap-3 mt-3">
                    <button
                      className="flex-1 px-3 py-2 rounded bg-primary text-white text-sm"
                      onClick={() =>
                        handleOrderStatusUpdate(order._id, "Order Confirmed")
                      }
                    >
                      Available
                    </button>
                    <button className="flex-1 px-3 py-2 rounded bg-red-500 text-white text-sm">
                      Unavailable
                    </button>
                  </div>
                )}
                <span className="text-xs text-gray-500">
                  *Please confirm that the above Products are available is
                  ordered
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
