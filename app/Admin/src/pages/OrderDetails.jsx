import {
  Package,
  Hash,
  CreditCard,
  Truck,
  CalendarDays,
  MapPin,
  Mail,
  Banknote,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useAdminContext } from "../context/AdminContext";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useCoreContext } from "../context/CoreContext";

const OrderDetails = () => {
  const { orders, riders, getOrderStatus } = useAdminContext();
  const { currency } = useCoreContext();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [riderDetails, setRiderDetails] = useState(null);

  useEffect(() => {
    if (!orders || !orderId) return;
    const currentOrder = orders.find((order) => order._id === orderId);
    if (currentOrder?.riderId)
      setRiderDetails(
        riders.find((rider) => rider._id === currentOrder.riderId)
      );
    currentOrder.status = getOrderStatus(currentOrder)[1];
    setOrder(currentOrder);
  }, [orderId, orders]);

  return order ? (
    <div>
      <h3 className="text-gray-800 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Customer Details
      </h3>
      {/* Customer Info */}
      <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
          style={{
            backgroundImage: `url(${assets.profile_icon})`,
          }}
        ></div>
        <div className="flex flex-col justify-center">
          <p className="text-text text-base font-medium leading-normal line-clamp-1">
            {`${order.address.firstName} ${order.address.lastName}`}
          </p>
          <a
            className="text-primary text-sm font-normal leading-normal line-clamp-2"
            href={`tel:${order.address.phone}`}
          >
            {order.address.phone}
          </a>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2">
        <div className="text-text flex items-center justify-center rounded-lg bg-gray-200 shrink-0 size-12">
          {/* MapPin Icon */}
          <MapPin className="w-6 h-6" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-text text-base font-medium leading-normal line-clamp-1">
            Address
          </p>
          <p className="text-gray-600 text-sm font-normal leading-normal line-clamp-2">
            {order.address.address}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2">
        <div className="text-text flex items-center justify-center rounded-lg bg-gray-200 shrink-0 size-12">
          <Mail className="w-6 h-6" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-text text-base font-medium leading-normal line-clamp-1">
            Email
          </p>
          <a
            href={`mailto:${order.address.email}`}
            className="text-primary text-sm font-normal leading-normal line-clamp-2"
          >
            {order.address.email}
          </a>
        </div>
      </div>

      {/* Order Summary */}
      <h3 className="text-text text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Order Summary
      </h3>

      {[
        {
          name: "Organic Apples",
          vendor: "Fresh Foods Market",
          details:
            "Quantity: 2, Price: $20, Status: Delivered, Vendor ID: 12345",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoJSHn3zUpABt74Zq2R6FXQ11CjU2ByR6ZoV6SEOZbEMfvH_vw3oKr2PKkcJgBFVSoHYSQ8nszQ5a69wb9OuhpS5DKkkKqEziP7P4gq59qUaNwsk5msKesSyzq-TDKK3NqYP5s5gTgqVgj4NXQ2CW988UGjriloRenVvTmzUM_bwwDkx8iiDIfGyBgTIGPguI5pazrJW_cNaZBjc2H9YKQeyzJMqen5eIymhuCpr7TzP61Xxrub38_TpyUkRE4oA7IOIgKT-1s72-N",
        },
        {
          name: "Avocados",
          vendor: "Green Grocer",
          details:
            "Quantity: 1, Price: $15, Status: Delivered, Vendor ID: 67890",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE0X99Pp3cxAWF8KgzxFrtLYWuvdmkQpmS268Vl-UQZmBmbn-ijEWisyD-nwaa0mj-O0EPnxFIakjXJogzQm3dXlC6Cb9cuQaJU82cW4xV4RZjt3r1RGuGJ3v_TAvEp5D6bGmfWUdrFpV1wfpSdNGKve3dLv0ngqB1d7BuS_HqMuyAIH6Zy9dwUCsvIRns91RochEOmZU_iOYasY-n9SCh2nAtKXK8hiYg04QaaizOid8MJ27WfJDSkmYyNelzkur_brx8Kwf44jos",
        },
        {
          name: "Tomatoes",
          vendor: "Local Farms",
          details:
            "Quantity: 3, Price: $10, Status: Delivered, Vendor ID: 24680",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAw3I4L-jJ5BUQEnH_CRZM5HD7hKqpChQUJaSXZ60NHWD2EcjvlixR5g3L_Mqiv5DDst8Vrk-Qjh3oTj5zbDi1lvaCnBCkXNrjI-60pYEZ_-pw7m3nrPKfmZ0KWObR2-R_s-cvDiyPKuG2adpRF1kA7W-4sl25AKdw_6s2cxkMzUJfnHAfmlNOuIk4c2x4iLCyZttvOLRDBjPElKvwrXo0wJniEHLyzX-N0sXVtUQHQPf5kxiozBbdSUXdILpIWx03ZTU5ntUqp4o5",
        },
      ].map((item, i) => (
        <div key={i} className="flex gap-4 bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-center rounded-lg shrink-0 size-12 bg-gray-200 text-text">
            <Package className="w-6 h-6" />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <p className="text-text text-base font-medium leading-normal">
              {item.name}
            </p>
            <p className="text-gray-600 text-sm font-normal leading-normal">
              Vendor: <span className="text-primary"> {item.vendor}</span>
            </p>
            <p className="text-gray-600 text-sm font-normal leading-normal">
              {item.details}
            </p>
          </div>
        </div>
      ))}

      {/* Rider Details */}
      {riderDetails && (
        <div>
          <h3 className="text-text text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Rider Details
          </h3>

          <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
              style={{
                backgroundImage: `url(${assets.profile_icon})`,
              }}
            ></div>
            <div className="flex flex-col justify-center">
              <p className="text-text text-base font-medium leading-normal line-clamp-1">
                {riderDetails.name}
              </p>
              <a
                className="text-primary text-sm font-normal leading-normal line-clamp-2"
                href={`tel:${riderDetails.number}`}
              >
                {riderDetails.number}
              </a>
            </div>
          </div>
          {order.status === "Assigned" && (
            <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14">
              <div className="text-text flex items-center justify-center rounded-lg bg-gray-200 shrink-0 size-10">
                <Truck className="w-6 h-6 " />
              </div>
              <p className="text-red-500 text-base font-normal leading-normal flex-1 truncate">
                Cancel Rider
              </p>
            </div>
          )}
        </div>
      )}
      {/* Order Information */}
      <h3 className="text-text text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Order Information
      </h3>

      {/* Order ID */}
      <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14">
        <div className="text-text flex items-center justify-center rounded-lg bg-gray-200 shrink-0 size-10">
          <Hash className="w-6 h-6" />
        </div>
        <p className="text-text text-base font-normal leading-normal flex-1 truncate">
          Order ID: {order._id}
        </p>
      </div>

      {/* Order Date */}
      <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14">
        <div className="text-text flex items-center justify-center rounded-lg bg-gray-200 shrink-0 size-10">
          <CalendarDays className="w-6 h-6" />
        </div>
        <p className="text-text text-base font-normal leading-normal flex-1 truncate">
          Order Date: {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Total Amount */}
      <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14">
        <div className="text-text flex items-center justify-center rounded-lg bg-gray-200 shrink-0 size-10">
          <Banknote className="w-6 h-6" />
        </div>
        <p className="text-text text-base font-normal leading-normal flex-1 truncate">
          Total Amount: {currency}
          {order.amount}
        </p>
      </div>

      {/* Payment Status */}
      {/* <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14">
        <div className="text-text flex items-center justify-center rounded-lg bg-gray-200 shrink-0 size-10">
         
          <CreditCard className="w-6 h-6" />
        </div>
        <p className="text-text text-base font-normal leading-normal flex-1 truncate">
          Payment Status: Paid
        </p>
      </div> */}

      {/* Buttons */}
      <div className="flex justify-stretch">
        <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Contact Customer</span>
          </button>

          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-red-500 text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Process Refund</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default OrderDetails;
