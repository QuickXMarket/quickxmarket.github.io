import React, { useState, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import Loading from "../components/Loading";

const VendorRequests = () => {
  const [vendorRequests, setVendorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { makeRequest, getRelativeDayLabel } = useCoreContext();

  const getVendorRequests = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/vendor-requests",
        method: "GET",
      });
      console.log(data);
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
        vendorRequests.map((request, index) => {
          <div
            key={index}
            class="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2"
          >
            <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
              style={`background-image: url(${request.profilePhoto});`}
            ></div>
            <div class="flex flex-col justify-center">
              <p class="text-gray-600 text-base font-medium leading-normal line-clamp-1">
                {request.businessName}
              </p>
              <p class="text-text text-sm font-normal leading-normal line-clamp-2">
                Submitted {getRelativeDayLabel(request.createdAt)}
              </p>
            </div>
          </div>;
        })
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default VendorRequests;
