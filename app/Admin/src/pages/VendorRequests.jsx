import React, { useState, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import Loading from "../components/Loading";

const VendorRequests = () => {
  const [vendorRequests, setVendorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { makeRequest, getRelativeDayLabel, navigate } = useCoreContext();

  const getVendorRequests = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/vendor-requests",
        method: "GET",
      });
      if (data.success) {
        setVendorRequests(data.vendorRequests);
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
    <div>
   
      {!loading ? (
        vendorRequests.map((request, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2"
            onClick={() => navigate(`/vendor-requests/${request._id}`)}
          >
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
              style={{ backgroundImage: `url(${request.profilePhoto})` }}
            ></div>
            <div className="flex flex-col justify-center">
              <p className="text-gray-600 text-base font-medium leading-normal line-clamp-1">
                {request.businessName}
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

export default VendorRequests;
