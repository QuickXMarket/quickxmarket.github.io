import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { useCoreContext } from "../../context/CoreContext";

const RiderLogin = () => {
  const { setShowRiderLogin, user, setIsRider } = useAuthContext();
  const { navigate, axios, location } = useCoreContext();

  const [fullName, setFullName] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [vehicle, setVehicle] = useState("bicycle");

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

    try {
      const data = {
        userId: user._id,
        name: fullName,
        number,
        dob,
        vehicle,
      };

      const response = await axios.post("/api/rider/register", data);

      if (response.success) {
        const updateRes = await axios.patch("/api/user/update-role", {
          userId: user._id,
          role: "rider",
        });

        if (updateRes.success) {
          toast.success("Rider registered successfully");
          setIsRider(true);
          setShowRiderLogin(false);
          navigate("/rider");
        } else {
          console.error(updateRes);
          toast.error(updateRes.message || "Failed to update user role.");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 bg-white w-80 sm:w-[352px] p-8 py-12 rounded-lg shadow-xl border border-gray-200 text-sm text-gray-600"
      >
        <div className="w-full">
          <p>Full Name</p>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        <div className="w-full">
          <p>Phone Number</p>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter phone number"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        <div className="w-full">
          <p>Date of Birth</p>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        <div className="w-full">
          <p>Vehicle Type</p>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          >
            <option value="Bicycle">Bicycle</option>
            <option value="Motorcycle">Motorcycle</option>
          </select>
        </div>

        <button
          type="submit"
          className="cursor-pointer bg-primary text-white w-full py-2 rounded-md hover:bg-primary-dull transition"
        >
          Register as Rider
        </button>
      </form>
    </div>
  );
};

export default RiderLogin;
