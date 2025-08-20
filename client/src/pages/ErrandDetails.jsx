import React, { useState, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const InfoRow = ({ label, value }) => (
  <div className="col-span-2 grid grid-cols-[35%_1fr] border-t border-t-[#cedbe8] py-4 px-4 sm:px-6">
    <p className="text-primary text-sm font-normal">{label}</p>
    <p className="text-[#0d141c] text-sm font-normal break-words">{value}</p>
  </div>
);

const ErrandDetails = () => {
  const { axios, currency } = useCoreContext();
  const { id } = useParams();
  const [errand, setErrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchErrand = async () => {
    try {
      const { data } = await axios.get(`/api/errand/user`);
      if (data.success) {
        const errandsList = data.orders;
        const currentErrand = errandsList.find((e) => e._id === id);
        setErrand(currentErrand);
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
    if (id) fetchErrand();
  }, [id]);

  return (
    <div className="">
      {!loading && errand ? (
        <div className="space-y-3">
          {/* Errand Information */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Errand Information
          </h2>
          <div className="p-4 grid gap-x-6">
            <InfoRow label="Errand ID" value={errand._id} />
            <InfoRow label="Status" value={errand.status} />
            <InfoRow label="Fee" value={`${currency}${errand.fee}`} />
            <InfoRow label="Date" value={errand.createdAt} />
            <InfoRow
              label="Type"
              value={errand.isExpress ? "Express" : "Standard"}
            />
          </div>

          {/* Delivery Address */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Delivery Address
          </h2>
          <p className="text-[#0d141c] text-base px-4 pb-2">
            {errand.dropOff.address}
          </p>

          {/* Delivery Code */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Delivery Code
          </h2>
          {errand.deliveryCode && (
            <div className="flex justify-center gap-2 mt-2">
              {errand.deliveryCode.split("").map((digit, i) => (
                <div
                  key={i}
                  className="w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center border border-gray-300 rounded-md text-lg font-semibold text-gray-700 bg-gray-50"
                >
                  {digit}
                </div>
              ))}
            </div>
          )}

          {/* Errand Items */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Errand Items
          </h2>
          {errand.errands && errand.errands.length > 0 ? (
            <div className="space-y-4 px-4">
              {errand.errands.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-[#cedbe8] rounded-md space-y-2"
                >
                  <InfoRow label="Name" value={item.name} />
                  <InfoRow label="Phone" value={item.phone || "-"} />
                  <InfoRow label="Address" value={item.address} />
                  <InfoRow label="Note" value={item.deliveryNote || "-"} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#0d141c] text-base px-4 pb-2">
              No errands available.
            </p>
          )}

          {/* Rider Information */}
          <h2 className="text-primary text-xl sm:text-2xl font-bold tracking-tight px-4 pb-2 pt-5">
            Rider Information
          </h2>
          {errand.riderId ? (
            <div className="p-4 grid gap-x-6">
              <InfoRow label="Name" value={errand.riderId.name} />
              <InfoRow label="Phone" value={errand.riderId.phone} />
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

export default ErrandDetails;
