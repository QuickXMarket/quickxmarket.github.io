import React, { useState, useRef, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useMapContext } from "../context/MapContext";

const InputField = ({ type, placeholder, name, handleChange, value }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={value}
    required
  />
);

const ErrandRequest = () => {
  const { navigate, axios } = useCoreContext();
  const { user } = useAuthContext();
  const { getAddressSuggestions } = useMapContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // Multiple errands
  const [errands, setErrands] = useState([
    {
      name: "",
      address: "",
      phone: "",
      latitude: null,
      longitude: null,
      deliveryNote: "",
      suggestions: [],
      loading: false,
    },
  ]);

  const [isExpress, setIsExpress] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);

  const abortControllerRef = useRef(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setErrands((prev) => {
      const newErrands = [...prev];
      newErrands[index][name] = value;
      return newErrands;
    });

    if (name === "address") {
      fetchSuggestions(value, index);
    }
  };

  const fetchDeliveryFee = async (dropOff, errands) => {
    try {
      const { data } = await axios.post("/api/errand/delivery-fee", {
        dropOff,
        errands,
      });
      if (data.success) {
        setDeliveryFee(data.totalDeliveryFee);
      } else {
        setDeliveryFee(0);
        toast.error("Failed to fetch delivery fee");
      }
    } catch (error) {
      setDeliveryFee(0);
      toast.error(error.message);
    }
  };

  const fetchSuggestions = async (query, index) => {
    if (!query) {
      setErrands((prev) => {
        const newErrands = [...prev];
        newErrands[index].suggestions = [];
        newErrands[index].loading = false;
        return newErrands;
      });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setErrands((prev) => {
      const newErrands = [...prev];
      newErrands[index].loading = true;
      return newErrands;
    });

    try {
      const results = await getAddressSuggestions(query);

      setErrands((prev) => {
        const newErrands = [...prev];
        newErrands[index].suggestions = results;
        newErrands[index].loading = false;
        return newErrands;
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to fetch address suggestions");
    }
  };

  const onSuggestionClick = (suggestion, index) => {
    setErrands((prev) => {
      const newErrands = [...prev];
      newErrands[index].address = suggestion.description;
      newErrands[index].longitude = parseFloat(suggestion.location.lng);
      newErrands[index].latitude = parseFloat(suggestion.location.lat);
      newErrands[index].suggestions = [];
      return newErrands;
    });
  };

  const addErrand = () => {
    setErrands((prev) => [
      ...prev,
      {
        name: "",
        address: "",
        phone: "",
        latitude: null,
        longitude: null,
        deliveryNote: "",
        suggestions: [],
        loading: false,
      },
    ]);
  };

  const removeErrand = (index) => {
    setErrands((prev) => prev.filter((_, i) => i !== index));
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const submitDispatchRequest = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      toast.error("Please select a pick-up address.");
      return;
    }

    setErrands((prev) =>
      prev.map((errand) => {
        if (!errand.latitude || !errand.longitude) {
          toast.error("Please select a valid address from suggestions.");
        }
        return errand;
      })
    );

    const { data } = await axios.post("/api/payment/paystack-errand", {
      dropOff: selectedAddress._id,
      errands,
      isExpress,
      email: selectedAddress.email,
    });

    if (data.success) {
      setErrands([
        {
          name: "",
          address: "",
          phone: "",
          latitude: null,
          longitude: null,
          deliveryNote: "",
          suggestions: [],
          loading: false,
        },
      ]);
      setIsExpress(false);
      setServiceFee(0);
      setDeliveryFee(0);
      window.location.replace(data.url);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  useEffect(() => {
    let serviceFee = 0;
    const totalDeliveryFee = deliveryFee * (isExpress ? 1.5 : 1);
    if (totalDeliveryFee < 2500) {
      serviceFee = (1.5 * totalDeliveryFee) / 100;
    } else {
      serviceFee = (1.5 * totalDeliveryFee) / 100 + 100;
    }
    if (serviceFee > 2000) {
      serviceFee = 2000;
    }
    const roundedServiceFee = Math.ceil(serviceFee / 10) * 10;
    setServiceFee(roundedServiceFee);
  }, [deliveryFee, isExpress]);

  useEffect(() => {
    if (
      errands.every((errand) => errand.latitude && errand.longitude) &&
      selectedAddress
    ) {
      fetchDeliveryFee(selectedAddress, errands);
    }
  }, [errands, selectedAddress]);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 text-sm">
      {/* PICKUP LOCATION */}
      <section>
        <h2 className="font-semibold text-base mb-2">Delivery Address</h2>
        <div className="relative border rounded p-3">
          <div className="flex justify-between text-gray-600">
            <p className="max-w-[200px] truncate">
              {selectedAddress ? selectedAddress.address : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary text-xs hover:underline"
            >
              Change
            </button>
          </div>

          {showAddress && (
            <div className="absolute top-full mt-2 left-0 z-10 w-full bg-white border rounded shadow">
              {addresses.map((address, idx) => (
                <p
                  key={idx}
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAddress(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {address.address}
                </p>
              ))}
              <p
                onClick={() => navigate("/add-address")}
                className="text-center text-primary p-2 hover:bg-primary/10 cursor-pointer"
              >
                Add address
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ERRANDS */}
      <section>
        <h2 className="font-semibold text-base mb-2">Errand Details</h2>

        {errands.map((errand, index) => (
          <div key={index} className="border p-3 rounded mb-3 relative">
            {errands.length > 1 && (
              <div className="flex w-100 justify-end pb-2 pr-2">
                <button
                  type="button"
                  onClick={() => removeErrand(index)}
                  className="cursor-pointer text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
            )}
            <InputField
              handleChange={(e) => handleChange(e, index)}
              value={errand.name}
              name="name"
              type="text"
              placeholder="Business Name"
            />

            <div className="relative mt-2">
              <input
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                type="text"
                placeholder="Address"
                onChange={(e) => handleChange(e, index)}
                name="address"
                value={errand.address}
                required
              />
              {errand.suggestions.length > 0 && (
                <ul className="absolute z-50 bg-white border border-gray-300 rounded w-full max-h-40 overflow-auto mt-1">
                  {errand.suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => onSuggestionClick(suggestion, index)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <InputField
              handleChange={(e) => handleChange(e, index)}
              value={errand.phone}
              name="phone"
              type="text"
              placeholder="Phone (Optional)"
            />

            <textarea
              rows={3}
              className="w-full px-3 py-2 mt-2 border border-gray-500/30 rounded text-gray-700 outline-none focus:border-primary transition"
              placeholder="Describe the item or errand..."
              value={errand.deliveryNote}
              name="deliveryNote"
              onChange={(e) => handleChange(e, index)}
            />

            {/* Remove button */}
          </div>
        ))}

        <button
          type="button"
          onClick={addErrand}
          className="mt-2 text-primary text-sm underline"
        >
          + Add Another Errand
        </button>
      </section>
      <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          name="deliverySpeed"
          checked={isExpress}
          onChange={() => setIsExpress(!isExpress)}
          className="accent-primary w-4 h-4"
        />
        <span>Express Delivery</span>
      </label>

      {/* ORDER SUMMARY */}
      <section className="border-t pt-4">
        <h2 className="font-semibold text-base mb-2">Order Summary</h2>
        <div className="space-y-1 text-gray-600">
          <div className="flex justify-between">
            <span>Errand Fee</span>
            <span>₦{deliveryFee * (isExpress ? 1.5 : 1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>₦{serviceFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-black">
            <span>Total</span>
            <span>₦{deliveryFee * (isExpress ? 1.5 : 1) + serviceFee}</span>
          </div>
        </div>
      </section>

      {/* SUBMIT */}
      <button
        onClick={submitDispatchRequest}
        className="w-full py-3 mt-4 bg-primary hover:bg-primary-dull text-white rounded uppercase transition  cursor-pointer"
      >
        Submit Dispatch Request
      </button>
    </div>
  );
};

export default ErrandRequest;
