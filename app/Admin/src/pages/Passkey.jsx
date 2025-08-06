import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";

const Passkey = () => {
  const { setAdmin, setLoggedIn } = useAuthContext();
  const { secureSet, secureGet, navigate, hash } = useCoreContext();
  const [passkey, setPasskey] = useState("");
  const [confirmPasskey, setConfirmPasskey] = useState("");
  const [state, setState] = useState("enter");

  const handleDigitClick = (digit) => {
    if (passkey.length < 6) {
      setPasskey((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPasskey((prev) => prev.slice(0, -1));
  };

  const renderDisplay = () => {
    const display = passkey.split("");
    while (display.length < 6) display.push("_");
    return display.map((char, i) => (
      <span key={i} className="text-3xl mx-2 border-b-2 w-6 text-center">
        {char}
      </span>
    ));
  };

  const digitButtons = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ["←", 0, "CLR"],
  ];

  const onComplete = async (passkey) => {
    if (state === "set") {
      setPasskey("");
      setConfirmPasskey(passkey);
      setState("confirm");
      return;
    }
    if (state === "confirm") {
      if (passkey !== confirmPasskey) {
        toast.error("Passkeys do not match. Please try again.");
        return;
      }
      const hashedPasskey = await hash(passkey);

      await secureSet("passkey", hashedPasskey);
      toast.success("Passkey set successfully!");
      passKeyConfirmed();
      return;
    }

    const storedHash = await secureGet("passkey");
    const hashedPasskey = await hash(passkey);
    const isMatch = storedHash === hashedPasskey;
    if (isMatch) {
      passKeyConfirmed();
    } else {
      toast.error("Invalid passkey. Please try again.");
    }
  };

  const passKeyConfirmed = async () => {
    const adminData = await secureGet("admin");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    const fetchPasskey = async () => {
      const storedHash = await secureGet("passkey");
      if (!storedHash) {
        setState("set");
        return;
      }
      setPasskey("");
    };
    fetchPasskey();
  }, []);

  useEffect(() => {
    if (passkey.length === 6) {
      onComplete(passkey);
    }
  }, [passkey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-6">
        {state === "enter"
          ? "Enter"
          : state === "set"
          ? "Create New"
          : "Confirm"}{" "}
        Passkey
      </h2>
      <div className="flex gap-2 mb-8">{renderDisplay()}</div>

      <div className="grid grid-cols-3 gap-12 mb-8">
        {digitButtons.flat().map((item, i) => (
          <button
            key={i}
            className="p-4 text-xl rounded hover:bg-gray-300"
            onClick={() => {
              if (item === "←") handleBackspace();
              else if (item === "CLR") setPasskey("");
              else handleDigitClick(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* <button
        onClick={handleConfirm}
        className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={passkey.length !== 6}
      >
        Confirm
      </button> */}
    </div>
  );
};

export default Passkey;
