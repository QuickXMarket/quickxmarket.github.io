import React, { useState, useRef, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const DispatchRequest = () => {
  const {
    navigate,
    makeRequest,
    fuse,
    Preferences,
    DefaultWebViewOptions,
    InAppBrowser,
    Browser,
  } = useCoreContext();
  const { user } = useAuthContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    latitude: null,
    longitude: null,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [isExpress, setIsExpress] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);

  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));

    if (name === "address") {
      fetchSuggestions(value);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setAddress((prevAddress) => ({
      ...prevAddress,
      longitude: null,
      latitude: null,
    }));

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const results = fuse.search(query).slice(0, 5);
      const suggestionsData = results.map((result) => result.item);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to fetch address suggestions");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryFee = async (
    latitude1,
    longitude1,
    latitude2,
    longitude2
  ) => {
    try {
      const data = await makeRequest({
        method: "POST",
        url: "/api/dispatch/delivery-fee",
        data: {
          latitude1,
          longitude1,
          latitude2,
          longitude2,
        },
      });
      if (data.success) {
        setDeliveryFee(data.deliveryFee);
      } else {
        setDeliveryFee(0);
        toast.error("Failed to fetch delivery fee");
      }
    } catch (error) {
      setDeliveryFee(0);
      toast.error(error.message);
    }
  };

  const onSuggestionClick = (suggestion) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      address: `${suggestion.display_name} ${suggestion.street || ""}`,
      longitude: parseFloat(suggestion.lon),
      latitude: parseFloat(suggestion.lat),
    }));

    setSuggestions([]);
  };

  const getUserAddress = async () => {
    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/address/get",
      });
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
      toast.error("Invalid email format.");
      return;
    }

    const phoneRegex =
      /^(?:\+?234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|911|912|913|915|916)\d{7}$/;

    if (loading) {
      toast.error("Address is still loading, please wait.");
      return;
    }

    if (!phoneRegex.test(address.phone)) {
      toast.error("Please enter a valid Nigerian phone number.");
      return;
    }

    if (address.latitude === null || address.longitude === null) {
      toast.error("Please select a valid address from suggestions.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a pick-up address.");
      return;
    }

    const isNativeApp = Capacitor.isNativePlatform();

    const data = await makeRequest({
      method: "POST",
      url: "/api/payment/paystack-dispatch",
      data: {
        pickupAddress: selectedAddress._id,
        dropoff: address,
        deliveryNote,
        isExpress,
        email: selectedAddress.email,

        isNativeApp,
      },
    });

    if (data.success) {
      if (isNativeApp) {
        await Preferences.set({
          key: "reference",
          value: data.reference,
        });
        // await InAppBrowser.openInWebView({
        //   url: data.url,
        //   options: {
        //     ...DefaultWebViewOptions,
        //     toolbarTop: false,
        //     hideUrlBar: true,
        //   },
        // });
        await Browser.open({ url: data.url });
      } else {
        window.location.replace(data.url);
      }
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
      selectedAddress?.latitude != null &&
      selectedAddress?.longitude != null &&
      address.latitude != null &&
      address.longitude != null
    ) {
      fetchDeliveryFee(
        selectedAddress.latitude,
        selectedAddress.longitude,
        address.latitude,
        address.longitude
      );
    }
  }, [selectedAddress, address.latitude, address.longitude]);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 text-sm">
      {/* PICKUP LOCATION */}
      <section>
        <h2 className="font-semibold text-base mb-2">Pick-up Location</h2>
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

      {/* DROP-OFF LOCATION */}
      <section>
        <h2 className="font-semibold text-base mb-2">Drop-off Details</h2>
        <form className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              handleChange={handleChange}
              address={address}
              name="firstName"
              type="text"
              placeholder="First Name"
            />
            <InputField
              handleChange={handleChange}
              address={address}
              name="lastName"
              type="text"
              placeholder="Last Name"
            />
          </div>

          <InputField
            handleChange={handleChange}
            address={address}
            name="email"
            type="email"
            placeholder="Email address"
          />

          <div className="relative">
            <input
              className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
              type="text"
              placeholder="Address"
              onChange={handleChange}
              name="address"
              value={address.address}
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-300 rounded w-full max-h-40 overflow-auto mt-1">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <InputField
            handleChange={handleChange}
            address={address}
            name="phone"
            type="text"
            placeholder="Phone"
          />
        </form>
      </section>

      {/* DELIVERY DETAILS */}
      <section>
        <h2 className="font-semibold text-base mb-2">Delivery Details</h2>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border border-gray-500/30 rounded text-gray-700 outline-none focus:border-primary transition"
          placeholder="Describe the item or delivery..."
          value={deliveryNote}
          onChange={(e) => setDeliveryNote(e.target.value)}
        />

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
      </section>

      {/* ORDER SUMMARY */}
      <section className="border-t pt-4">
        <h2 className="font-semibold text-base mb-2">Order Summary</h2>
        <div className="space-y-1 text-gray-600">
          <div className="flex justify-between">
            <span>Delivery Fee</span>
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

      {/* SUBMIT BUTTON */}
      <button
        onClick={submitDispatchRequest}
        className="w-full py-3 mt-4 bg-primary hover:bg-primary-dull text-white rounded uppercase transition"
      >
        Submit Dispatch Request
      </button>
    </div>
  );
};

export default DispatchRequest;
