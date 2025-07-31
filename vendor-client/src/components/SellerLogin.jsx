import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";

const SellerLogin = () => {
  const { axios, navigate, fuse, location } = useCoreContext();
  const { setShowSellerLogin, user } = useAuthContext();

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLatitude(null);
    setLongitude(null);

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

  const onAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    fetchSuggestions(value);
  };

  const onSuggestionClick = (suggestion) => {
    setAddress(`${suggestion.display_name}, ${suggestion.street || ""}`);
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setSuggestions([]);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const phoneRegex =
      /^(?:\+?234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|911|912|913|915|916)\d{7}$/;

    if (loading) {
      toast.error("Address is still loading, please wait.");
      return;
    }
    if (!businessName || !number || !address) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!phoneRegex.test(number)) {
      toast.error("Please enter a valid Nigerian phone number.");
      return;
    }

    if (latitude === null || longitude === null) {
      toast.error("Please select a valid address from suggestions.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("businessName", businessName);
      formData.append("number", number);
      formData.append("address", address);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const { data } = await axios.post("/api/seller/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        // Update user role to vendor
        try {
          const updateRoleRes = await axios.patch("/api/user/update-role", {
            userId: user._id,
            role: "vendor",
          });
          if (updateRoleRes.data.success) {
            toast.success("Vendor registered successfully and role updated");
            setShowSellerLogin(false);
            navigate("/seller");
          } else {
            toast.error(
              "Vendor registered but failed to update role: " +
                updateRoleRes.data.message
            );
          }
        } catch (error) {
          toast.error(
            "Vendor registered but error updating role: " + error.message
          );
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSellerLoginCLose = () => {
    setShowSellerLogin(false);
    if (location.pathname === "/seller") navigate("/");
  };

  return (
    <div
      onClick={() => handleSellerLoginCLose()}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-center p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <label htmlFor="profilePhoto" className="cursor-pointer">
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={onFileChange}
            hidden
          />
          <img
            src={uploadPreview || assets.upload_area}
            alt="Upload Area"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        </label>
        <div className="w-full">
          <p>Business Name</p>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter business name"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>
        <div className="w-full">
          <p>Number</p>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter contact number"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>
        <div className="w-full relative">
          <p>Address</p>
          <input
            type="text"
            value={address}
            onChange={onAddressChange}
            placeholder="Enter business address"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
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
                  {`${suggestion.display_name}, ${suggestion.street || ""}`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <label className="flex items-start text-sm gap-2 text-gray-700">
          <input type="checkbox" required className="mt-1 accent-primary" />
          <span>
            I agree to the{" "}
            <NavLink
              href="/customer-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary-dull"
            >
              Terms and Conditions
            </NavLink>
          </span>
        </label>
        <button
          type="submit"
          disabled={loading || latitude === null || longitude === null}
          className={`cursor-pointer bg-primary text-white w-full py-2 rounded-md transition-all ${
            loading || latitude === null || longitude === null
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-primary-dull"
          }`}
        >
          Register Business
        </button>
      </form>
    </div>
  );
};

export default SellerLogin;
