import React, { useState, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import Loading from "../components/Loading";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const RiderRequestDetails = () => {
  const [loading, setLoading] = useState(true);
  const { makeRequest, navigate } = useCoreContext();
  const [request, setRequest] = useState();
  const [remarks, setRemarks] = useState("");
  const [responding, setResposning] = useState(false);
  const [showNinImage, setShowNinImage] = useState(false);
  const { requestId } = useParams();
  const [response, setResponse] = useState("");

  const getRiderRequests = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/rider-requests",
        method: "GET",
      });
      if (data.success) {
        const riderRequests = data.riderRequests;
        const currentRequest = riderRequests.find(
          (request) => request._id === requestId
        );
        setRequest(currentRequest);
      }
    } catch (error) {
      console.error("Error fetching rider requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRiderRequests();
  }, []);

  const handleRequestResponse = async (approved) => {
    setResposning(true);
    setResponse(approved);
    try {
      const data = await makeRequest({
        url: "/api/admin/riderRequestResponse",
        method: "POST",
        data: { approved, requestId, remarks },
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/rider-requests");
      }
    } catch (error) {
      toast.error("Failed to process rider request. Please try again.");
      console.error(error);
    } finally {
      setResposning(false);
    }
  };

  return (
    <>
      {!loading ? (
        <div>
          <div className="@container">
            <div className="@[480px]:px-4 @[480px]:py-3">
              <div class="flex gap-4 flex-col items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                  style={{
                    backgroundImage: `url(${
                      request.profilePhoto || assets.profile_icon
                    })`,
                  }}
                ></div>
                <h1 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
                  {request.name}
                </h1>
              </div>
            </div>
          </div>

          <p className="text-text text-base font-normal leading-normal pb-3 pt-1 px-4">
            <span className="font-semibold">Phone: </span> {request.number}
          </p>

          <p className="text-text text-base font-normal leading-normal pb-3 pt-1 px-4">
            <span className="font-semibold">Vehicle Type: </span>{" "}
            {request.vehicleType}
          </p>

          <p className="text-text text-base font-normal leading-normal pb-3 pt-1 px-4">
            <span className="font-semibold">Date of Birth: </span>{" "}
            {new Date(request.dob).toLocaleDateString()}
          </p>

          <div className="px-4 py-3">
            <button
              onClick={() => setShowNinImage(!showNinImage)}
              className="text-primary text-sm font-medium underline "
            >
              {showNinImage ? "Hide NIN Image" : "Show NIN Image"}
            </button>

            {showNinImage && request.ninImageUrl && (
              <div className="mt-3">
                <img
                  src={request.ninImageUrl}
                  alt="Rider NIN"
                  className="w-full max-w-md rounded-lg border"
                />
              </div>
            )}
          </div>

          <h3 className="text-text text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            User ID
          </h3>
          <p
            onClick={() => navigate(`/userDetails/${request.userId}`)}
            className="text-primary text-base font-normal leading-normal pb-3 pt-1 px-4 cursor-pointer"
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
                <span className="truncate">
                  {`${responding && response ? "Accepting..." : "Accept"}`}
                </span>
              </button>
              <button
                disabled={responding}
                onClick={() => handleRequestResponse(false)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-red-500 text-text text-base font-bold leading-normal tracking-[0.015em] grow"
              >
                <span className="truncate">
                  {`${responding && !response ? "Rejecting..." : "Reject"}`}
                </span>
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

export default RiderRequestDetails;
