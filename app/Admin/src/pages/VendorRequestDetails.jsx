import React, { useState } from "react";
import { useCoreContext } from "../context/CoreContext";
import Loading from "../components/Loading";

const VendorRequestDetails = ({ request }) => {
  const [loading, setLoading] = useState(true);
  const { makeRequest, getRelativeDayLabel } = useCoreContext();
  const [request, setRequest] = useState();
  const { requestId } = useParams();

  const getVendorRequests = async () => {
    try {
      const { data } = await makeRequest({
        url: "/admin/vendor-requests",
        method: "GET",
      });
      if (data.success) {
        const vendorRequests = data.vendorRequests;
        const currentRequest = vendorRequests.find(
          (request) => request._id === requestId
        );
        setRequest(currentRequest);
      }
    } catch (error) {
      console.error("Error fetching vendor requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendorRequests();
  }, []);

  return (
    <>
      {!loading ? (
        <div>
          <div className="@container">
            <div className="@[480px]:px-4 @[480px]:py-3">
              <div
                className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-gray-50 @[480px]:rounded-lg min-h-[218px]"
                style={{
                  backgroundImage: `url("${
                    request.profilePhoto ||
                    "https://via.placeholder.com/400x200?text=No+Image"
                  }")`,
                }}
              ></div>
            </div>
          </div>

          <h1 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
            {request.businessName}
          </h1>
          <p className="text-[#0d141c] text-base font-normal leading-normal pb-3 pt-1 px-4">
            {request.number}
          </p>
          <p className="text-[#0d141c] text-base font-normal leading-normal pb-3 pt-1 px-4">
            {request.address}
          </p>

          <h3 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            User ID
          </h3>
          <p className="text-primary text-base font-normal leading-normal pb-3 pt-1 px-4">
            {request.userId}
          </p>

          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <textarea
                placeholder="Add comments"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-slate-50 focus:border-[#cedbe8] min-h-36 placeholder:text-[#49739c] p-[15px] text-base font-normal leading-normal"
              ></textarea>
            </label>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#0d80f2] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] grow">
                <span className="truncate">Accept</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#e7edf4] text-[#0d141c] text-base font-bold leading-normal tracking-[0.015em] grow">
                <span className="truncate">Reject</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default VendorRequestDetails;
