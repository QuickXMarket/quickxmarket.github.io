import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";
import { assets } from "../assets/assets";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { NavLink } from "react-router";

const RiderLogin = () => {
  const { makeRequest, fileToBase64 } = useCoreContext();

  const [fullName, setFullName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [vehicle, setVehicle] = useState("Bicycle");
  const [ninImage, setNinImage] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const pickNinImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });
      setNinImage(image.dataUrl);
    } catch (error) {
      console.error("Image pick cancelled", error);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const phoneRegex =
      /^(?:\+?234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|911|912|913|915|916)\d{7}$/;

    if (!fullName || !number || !dob || !vehicle) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!phoneRegex.test(number)) {
      toast.error("Enter a valid Nigerian phone number.");
      return;
    }

    if (validateAge(dob) < 15) {
      toast.error("You must be at least 15 years old to register.");
      return;
    }

    if (!ninImage) {
      toast.error("Please upload your NIN card/slip.");
      return;
    }

    if (!profilePhoto) {
      toast.error("Please upload a profile photo.");
      return;
    }

    let profilePhotoBase64 = null;
    if (profilePhoto) {
      profilePhotoBase64 = await fileToBase64(profilePhoto);
    }

    try {
      setLoading(true);
      const data = {
        name: fullName,
        number,
        dob,
        vehicle,
        ninImage,
        profilePhoto: profilePhotoBase64,
      };

      const response = await makeRequest({
        method: "POST",
        url: "/api/rider/sendRegisterRequest",
        data,
      });

      if (response.success) {
        toast.success("Rider registration request sent. Awaiting approval.");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center ">
      {!submitted ? (
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 w-[90%] max-w-sm p-8 rounded-2xl shadow-2xl  bg-background transition-all"
        >
          <p className="text-xl font-semibold text-center text-gray-800 dark:text-white">
            Rider Registration
          </p>
          {/* Profile Upload */}
          <label
            htmlFor="profilePhoto"
            className="relative w-24 h-24 mx-auto cursor-pointer group"
          >
            <input
              type="file"
              id="profilePhoto"
              disabled={loading}
              accept="image/*"
              onChange={onFileChange}
              required
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

          {/* Full Name */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 ">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              disabled={loading}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              required
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
            />
          </div>

          {/* Phone Number */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 ">
              Phone Number
            </label>
            <input
              type="tel"
              value={number}
              disabled={loading}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter phone number"
              required
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
            />
          </div>

          {/* Date of Birth */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 ">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              disabled={loading}
              onChange={(e) => setDob(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
            />
          </div>

          {/* NIN Card/Slip Upload */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700">
              National Identification Number (NIN) Card/Slip
            </label>
            <div
              onClick={pickNinImage}
              disabled={loading}
              className="mt-1 w-full flex items-center justify-center px-3 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-all bg-gray-50"
            >
              {ninImage ? (
                <img
                  src={ninImage}
                  alt="NIN Preview"
                  className="h-32 object-contain"
                />
              ) : (
                <p className="text-sm text-gray-500">
                  Tap to upload NIN card/slip
                </p>
              )}
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 ">
              Vehicle Type
            </label>
            <select
              value={vehicle}
              disabled={loading}
              onChange={(e) => setVehicle(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
            >
              <option value="" disabled>
                Select vehicle type
              </option>
              <option value="Bicycle">Bicycle</option>
              <option value="Motorcycle">Motorcycle</option>
            </select>
          </div>
          <label className="flex items-start text-sm gap-2 text-gray-700">
            <input type="checkbox" required className="mt-1 accent-primary" />
            <span>
              I agree to the{" "}
              <NavLink
                to="https://quickxmarket.com.ng/rider-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary-dull"
              >
                Terms and Conditions
              </NavLink>
            </span>
          </label>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dull transition-all"
          >
            {`${loading ? "Registering as Rider..." : "Register as Rider"}`}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center w-[90%] max-w-sm p-8 rounded-2xl shadow-2xl border border-gray-200 bg-white dark:bg-background text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">
            Registration Submitted!
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your rider registration request has been successfully submitted. Our
            team will review your application and get back to you soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiderLogin;
