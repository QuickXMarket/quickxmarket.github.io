import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAuthContext } from "../../context/AuthContext";
import { useCoreContext } from "../../context/CoreContext";

const SellerLogin = () => {
  const { setShowSellerLogin, user } = useAuthContext();
  const { navigate, makeRequest, fileToBase64, location, fuse } =
    useCoreContext();

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
    setAddress(`${suggestion.display_name} ${suggestion.street || ""}`);
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
      let profilePhotoBase64 = null;
      if (profilePhoto) {
        profilePhotoBase64 = await fileToBase64(profilePhoto);
      }

      const data = {
        userId: user._id,
        businessName,
        number,
        address,
        latitude,
        longitude,
        profilePhoto: profilePhotoBase64,
      };

      const response = await makeRequest({
        method: "POST",
        url: "/api/seller/register",
        data,
      });

      if (response.success) {
        // Update user role to vendor
        try {
          const updateRoleRes = await makeRequest({
            method: "PATCH",
            url: "/api/user/update-role",
            data: {
              userId: user._id,
              role: "vendor",
            },
          });
          if (updateRoleRes.success) {
            toast.success("Vendor registered successfully and role updated");
            setShowSellerLogin(false);
            navigate("/seller");
          } else {
            toast.error(
              "Vendor registered but failed to update role: " +
                updateRoleRes.message
            );
          }
        } catch (error) {
          toast.error(
            "Vendor registered but error updating role: " + error.message
          );
        }
      } else {
        toast.error(response.message);
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
      onClick={handleSellerLoginCLose}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-5 w-[90%] max-w-sm p-8 rounded-2xl shadow-2xl border border-gray-200 bg-background  transition-all"
      >
        {/* Profile Upload */}
        <label
          htmlFor="profilePhoto"
          className="relative w-24 h-24 mx-auto cursor-pointer group"
        >
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={onFileChange}
            hidden
          />
          <img
            src={uploadPreview || assets.upload_area}
            alt="Upload"
            className="rounded-full object-cover w-full h-full border border-gray-300 shadow-inner group-hover:brightness-90"
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Change
          </div>
        </label>

        {/* Business Name */}
        <div className="w-full">
          <label className="text-sm font-medium text-gray-700 ">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter business name"
            disabled={loading}
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
            required
          />
        </div>

        {/* Contact Number */}
        <div className="w-full">
          <label className="text-sm font-medium text-gray-700 ">
            Phone Number
          </label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter contact number"
            disabled={loading}
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
            required
          />
        </div>

        {/* Address with Suggestions */}
        <div className="w-full relative">
          <label className="text-sm font-medium text-gray-700 ">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={onAddressChange}
            placeholder="Enter business address"
            autoComplete="off"
            disabled={loading}
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-50 bg-gray-50 border border-gray-300 dark:border-gray-700 rounded w-full max-h-40 overflow-auto mt-1 shadow-md">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || latitude === null || longitude === null}
          className={`w-full py-2 text-sm font-medium text-white rounded-md transition-all ${
            loading || latitude === null || longitude === null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dull"
          }`}
        >
          {loading ? "Registering..." : "Register Business"}
        </button>
      </form>
    </div>
  );
};

export default SellerLogin;
