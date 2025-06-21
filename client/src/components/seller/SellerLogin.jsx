import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const SellerLogin = () => {
  const { setShowUserLogin, axios, navigate, user } = useAppContext();

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [uploadPreview, setUploadPreview] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const limit = 5;
      const left = 5.564212639756239;
      const right = 5.654812639756239;
      const top = 6.445101079346673;
      const bottom = 6.355101079346673;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=${limit}&viewbox=${left},${top},${right},${bottom}&bounded=1`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const onAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    fetchSuggestions(value);
  };

  const onSuggestionClick = (suggestion) => {
    setAddress(suggestion.display_name);
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setSuggestions([]);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!businessName || !number || !address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Upload profile photo to backend API which uploads to Cloudinary and returns URL
      let profilePhotoUrl = "";
      if (profilePhoto) {
        const formData = new FormData();
        formData.append("file", profilePhoto);
        const uploadRes = await axios.post(
          "/api/upload/profile-photo",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        profilePhotoUrl = uploadRes.data.url;
      }

      const payload = {
        userId: user._id,
        profilePhoto: profilePhotoUrl,
        businessName,
        number,
        address,
        latitude,
        longitude,
      };

      const { data } = await axios.post("/api/seller/register", payload);
      if (data.success) {
        toast.success("Vendor registered successfully");
        setShowUserLogin(false);
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
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
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Register Business
        </button>
      </form>
    </div>
  );
};

export default SellerLogin;
