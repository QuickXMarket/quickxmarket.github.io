import React, { useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";

// Input Field Component
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

const AddAddress = () => {
  const { user } = useAuthContext();
  const { makeRequest, navigate, fuse } = useCoreContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
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

    setLatitude(null);
    setLongitude(null);

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

  const onSuggestionClick = (suggestion) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      address: `${suggestion.display_name} ${suggestion.street || ""}`,
    }));

    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setSuggestions([]);
  };

  const onSubmitHandler = async (e) => {
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

    if (latitude === null || longitude === null) {
      toast.error("Please select a valid address from suggestions.");
      return;
    }

    try {
      const payload = {
        ...address,
        latitude,
        longitude,
      };
      const data = await makeRequest({
        method: "POST",
        url: "/api/address/add",
        data: { address: payload },
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate(-1);
    }
  }, []);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
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
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-50 bg-white border border-gray-300 rounded w-full max-h-40 overflow-auto mt-1">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => onSuggestionClick(suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {`${suggestion.display_name} ${suggestion.street || ""}`}
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

            <button
              type="submit"
              disabled={loading || latitude === null || longitude === null}
              className={`w-full mt-6 py-3 uppercase transition cursor-pointer text-white ${
                loading || latitude === null || longitude === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dull"
              }`}
            >
              Save address
            </button>
          </form>
        </div>
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
