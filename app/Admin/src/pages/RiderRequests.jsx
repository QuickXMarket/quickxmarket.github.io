import React, { useState, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import Loading from "../components/Loading";
import { assets } from "../assets/assets";

const RiderRequests = () => {
  const [riderRequests, setRiderRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { makeRequest, getRelativeDayLabel, navigate } = useCoreContext();

  const getRiderRequests = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/rider-requests",
        method: "GET",
      });
      if (data.success) {
        setRiderRequests(data.riderRequests);
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

  return (
    <div>
      {!loading ? (
        riderRequests.map((request, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2"
            onClick={() => navigate(`/rider-requests/${request._id}`)}
          >
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
              style={{
                backgroundImage: `url(${
                  request.profilePhoto || assets.profile_icon
                })`,
              }}
            ></div>
            <div className="flex flex-col justify-center">
              <p className="text-gray-600 text-base font-medium leading-normal line-clamp-1">
                {request.name}
              </p>
              <p className="text-text text-sm font-normal leading-normal line-clamp-2">
                Submitted {getRelativeDayLabel(request.createdAt)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default RiderRequests;
