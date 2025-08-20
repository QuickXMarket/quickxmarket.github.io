import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

const RiderLogin = () => {
  const { setShowRiderLogin, user, setIsRider } = useAuthContext();
  const { navigate, makeRequest, location } = useCoreContext();

  const [fullName, setFullName] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [vehicle, setVehicle] = useState("bicycle");
  const [ninImage, setNinImage] = useState(null);

  const handleClose = () => {
    setShowRiderLogin(false);
    if (location.pathname === "/rider") navigate("/");
  };

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

    try {
      const data = {
        name: fullName,
        number,
        dob,
        vehicle,
        ninImage,
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
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 w-[90%] max-w-sm p-8 rounded-2xl shadow-2xl border border-gray-200 bg-background transition-all"
      >
        <p className="text-xl font-semibold text-center text-gray-800 dark:text-white">
          Rider Registration
        </p>

        {/* Full Name */}
        <div className="w-full">
          <label className="text-sm font-medium text-gray-700 ">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dull transition-all"
        >
          Register as Rider
        </button>
      </form>
    </div>
  );
};

export default RiderLogin;
