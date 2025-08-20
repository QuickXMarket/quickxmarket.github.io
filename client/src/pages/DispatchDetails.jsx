import React, { useState, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";

const InfoRow = ({ label, value }) => (
  <div className="col-span-2 grid grid-cols-[35%_1fr] border-t border-t-[#cedbe8] py-4 px-4 sm:px-6">
    <p className="text-primary text-sm font-normal">{label}</p>
    <p className="text-[#0d141c] text-sm font-normal break-words">{value}</p>
  </div>
);

const DispatchDetails = () => {
  const { navigate, currency, axios } = useCoreContext();
  const { id } = useParams();
  const [dispatch, setDispatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDispatch = async () => {
    try {
      const { data } = await axios.get(`/api/dispatch/user`);

      if (data.success) {
        const Orders = data.orders;
        const currentDispatch = Orders.find((order) => order._id === id);
        setDispatch(currentDispatch);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDispatch();
  }, [id]);

  return (
    <div className="">
      {!loading && dispatch ? (
        <div className="space-y-3">
          {/* Dispatch Information */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Dispatch Information
          </h2>
          <div className="p-4 grid gap-x-6">
            <InfoRow label="Dispatch ID" value={dispatch._id} />
            <InfoRow label="Status" value={dispatch.status} />
            <InfoRow label="Fee" value={`${currency}${dispatch.deliveryFee}`} />
            <InfoRow label="Date" value={dispatch.createdAt} />
            <InfoRow
              label="Delivery Type"
              value={dispatch.isExpress ? "Express" : "Standard"}
            />
          </div>
          {/* Delivery Code */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Delivery Code
          </h2>
          {dispatch.deliveryCode && (
            <div className="flex justify-center gap-2 mt-2">
              {dispatch.deliveryCode.split("").map((digit, i) => (
                <div
                  key={i}
                  className="w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center border border-gray-300 rounded-md text-lg font-semibold text-gray-700 bg-gray-50"
                >
                  {digit}
                </div>
              ))}
            </div>
          )}
          {/* Pickup Address */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Pickup Address
          </h2>
          <p className="text-[#0d141c] text-base px-4 pb-2">
            {dispatch.pickupAddress.address}
          </p>

          {/* Dropoff Details */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Dropoff Details
          </h2>
          <div className="p-4 grid gap-x-6">
            <InfoRow
              label="Name"
              value={`${dispatch.dropoff.firstName} ${dispatch.dropoff.lastName}`}
            />
            <InfoRow label="Phone" value={dispatch.dropoff.phone || "-"} />
            <InfoRow label="Address" value={dispatch.dropoff.address} />
          </div>

          {/* Delivery Note */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Delivery Note
          </h2>
          <p className="text-[#0d141c] text-base px-4 pb-2">
            {dispatch.deliveryNote || "-"}
          </p>

          {/* Rider Information */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Rider Information
          </h2>
          {dispatch.riderId ? (
            <div className="p-4 grid gap-x-6">
              <InfoRow label="Name" value={dispatch.riderId.name} />
              <InfoRow label="Phone" value={dispatch.riderId.phone} />
            </div>
          ) : (
            <p className="text-[#0d141c] text-base px-4 pb-2 ">
              A rider has not yet been assigned.
            </p>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default DispatchDetails;
