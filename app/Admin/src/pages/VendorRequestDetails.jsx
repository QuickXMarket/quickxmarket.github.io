import React, { useState, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import Loading from "../components/Loading";
import { useParams } from "react-router";
import toast from "react-hot-toast";

const VendorRequestDetails = () => {
  const [loading, setLoading] = useState(true);
  const { makeRequest, getRelativeDayLabel, navigate } = useCoreContext();
  const [request, setRequest] = useState();
  const [remarks, setRemarks] = useState("");
  const [responding, setResposning] = useState(false);
  const { requestId } = useParams();

  const getVendorRequests = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/vendor-requests",
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

  const handleRequestResponse = async (approved) => {
    try {
      const data = await makeRequest({
        url: "/api/admin/vendorRequestResponse",
        method: "POST",
        data: { approved, requestId, remarks },
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/vendor-requests");
      }
    } catch (error) {}
  };

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

          <h1 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
            {request.businessName}
          </h1>
          <p className="text-text text-base font-normal leading-normal pb-3 pt-1 px-4">
            {request.number}
          </p>
          <p className="text-text text-base font-normal leading-normal pb-3 pt-1 px-4">
            {request.address}
          </p>

          <h3 className="text-text text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            User ID
          </h3>
          <p
            onClick={() => navigate(`/userDetails/${request.userId}`)}
            className="text-primary text-base font-normal leading-normal pb-3 pt-1 px-4"
          >
            {request.userId}
          </p>

          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <textarea
                placeholder="Add comments"
                disabled={responding}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="dark:bg-gray-200 form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text focus:outline-0 focus:ring-0 border border-[#cedbe8]  focus:border-[#cedbe8] min-h-36 placeholder:text-gray-50 p-[15px] text-base font-normal leading-normal"
              ></textarea>
            </label>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
              <button
                disabled={responding}
                onClick={() => handleRequestResponse(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-slate-50 text-base font-bold leading-normal tracking-[0.015em] grow"
              >
                <span className="truncate">Accept</span>
              </button>
              <button
                disabled={responding}
                onClick={() => handleRequestResponse(false)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-red-500 text-text text-base font-bold leading-normal tracking-[0.015em] grow"
              >
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
