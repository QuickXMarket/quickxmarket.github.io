import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";
import { useRef } from "react";
import { useEffect } from "react";
import { assets } from "../assets/assets";

const Login = () => {
  const { setLoggedIn } = useAuthContext();
  const { makeRequest, navigate, secureSet, location } = useCoreContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setPasswordErrors([]);
      setLoading(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}|\\/<>"'=+~`_\-.,;:])[A-Za-z\d@$!%*?&#^()[\]{}|\\/<>"'=+~`_\-.,;:]{8,}$/;
      const phoneRegex =
        /^(?:\+?234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|911|912|913|915|916)\d{7}$/;

      if (!emailRegex.test(email)) {
        toast.error("Invalid email format.");
        return;
      }
      if (state === "register" && !phoneRegex.test(number)) {
        toast.error("Please enter a valid Nigerian phone number.");
        return;
      }

      if (!strongPasswordRegex.test(password)) {
        const errors = [];
        if (!/[a-z]/.test(password))
          errors.push("at least one lowercase letter");
        if (!/[A-Z]/.test(password))
          errors.push("at least one uppercase letter");
        if (!/\d/.test(password)) errors.push("at least one number");
        if (!/[@$!%*?&#^()[\]{}|\\/<>"'=+~`_\-.,;:]/.test(password))
          errors.push("at least one special character");
        if (password.length < 8) errors.push("minimum length of 8 characters");

        if (errors.length > 0) {
          console.log("Password must contain: " + errors.join(", ") + ".");
          setPasswordErrors(errors);
        }
        setLoading(false);
        return;
      }

      const payload = { name, email: email.toLowerCase(), password, number };

      const data = await makeRequest({
        method: "POST",
        url: `/api/admin/${state}`,
        data: payload,
      });

      if (data.success) {
        handleLoginSuccess(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendResetEmail = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        toast.error("Invalid email format.");
        return;
      }
      const data = await makeRequest({
        method: "POST",
        url: `/api/user/sendPasswordResetEmail`,
        data: {
          email,
        },
      });
      if (data.success) {
        setShowUserLogin(false);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLoginSuccess = async (data) => {
    await secureSet("authToken", data.token);
    await secureSet("authTokenExpiry", String(Date.now() + 30 * 86400000));
    await secureSet("admin", JSON.stringify(data.admin));
    setLoggedIn(true);
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4">
      <form
        onSubmit={(e) =>
          state !== "forgotPassword" ? onSubmitHandler(e) : sendResetEmail(e)
        }
        className="flex flex-col gap-5 w-full max-w-sm p-8 rounded-2xl shadow-2xl border border-gray-200 bg-white dark:bg-background transition-all"
      >
        <p className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          <span className="text-primary">Admin</span>{" "}
          {state === "login"
            ? "Login"
            : state === "register"
            ? "Sign Up"
            : "Forgot-Password"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              disabled={loading}
              placeholder="Full Name"
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm dark:text-text dark:bg-gray-200"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
            placeholder="Email Address"
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
            type="email"
            required
          />
        </div>

        {state === "register" && (
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              onChange={(e) => setNumber(e.target.value)}
              value={number}
              disabled={loading}
              placeholder="Phone Number"
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm dark:text-text dark:bg-gray-200"
              type="tel"
              required
            />
          </div>
        )}

        {state !== "forgotPassword" && (
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={loading}
              placeholder="Password"
              className={`mt-1 w-full px-3 py-2 text-sm border ${
                passwordErrors.length ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                passwordErrors.length
                  ? "focus:ring-red-500"
                  : "focus:ring-primary"
              } focus:border-transparent dark:bg-gray-200 dark:text-text`}
              type="password"
              autoComplete="current-password"
              required
            />
            {passwordErrors.length > 0 && (
              <ul className="mt-1 ml-1 text-xs text-red-600 space-y-0.5">
                {passwordErrors.map((err, index) => (
                  <li key={index}>• {err}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* {state === "login" && (
          <p
            className="text-sm text-right text-primary hover:underline cursor-pointer -mt-3"
            onClick={() => setState("forgotPassword")}
          >
            Forgot Password?
          </p>
        )} */}

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {state === "register"
            ? "Already have an account?"
            : "Create an account?"}{" "}
          <span
            disabled={loading}
            onClick={() =>
              setState(state === "register" ? "login" : "register")
            }
            className="text-primary cursor-pointer font-medium hover:underline"
          >
            Click here
          </span>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dull transition-all"
        >
          {state === "register"
            ? "Create Account"
            : state === "login"
            ? "Login"
            : "Send Reset Email"}
        </button>
      </form>
    </div>
  );
};

export default Login;
