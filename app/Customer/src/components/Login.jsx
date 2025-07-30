import React from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useProductContext } from "../context/ProductContext";
import { useCoreContext } from "../context/CoreContext";
import { useRef } from "react";
import { useEffect } from "react";
import { assets } from "../assets/assets";

const Login = () => {
  const { setShowUserLogin, setUser, setIsSeller, setIsRider, SocialLogin } =
    useAuthContext();
  const { makeRequest, navigate, Preferences, location } = useCoreContext();
  const { setCartItems, wishList, setWishList, cartItems } =
    useProductContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordErrors, setPasswordErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const googleButtonRef = useRef();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setPasswordErrors([]);
      setLoading(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}|\\/<>"'=+~`_\-.,;:])[A-Za-z\d@$!%*?&#^()[\]{}|\\/<>"'=+~`_\-.,;:]{8,}$/;

      if (!emailRegex.test(email)) {
        toast.error("Invalid email format.");
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

      const payload = { name, email: email.toLowerCase(), password };

      const data = await makeRequest({
        method: "POST",
        url: `/api/user/${state}`,
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
        if (location.pathname !== "/seller") navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    SocialLogin.initialize({
      google: {
        webClientId:
          "832406974597-tkp45ua226r508udf1ha7a8vhol0bmtb.apps.googleusercontent.com",
      },
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const res = await SocialLogin.login({
        provider: "google",
        options: {
          scopes: ["email", "profile"],
        },
      });
      const idToken = res?.result?.idToken;
      if (!idToken) return;
      try {
        const data = await makeRequest({
          url: "/api/user/google-signin",
          method: "POST",
          data: {
            token: idToken,
          },
        });

        if (data.success) {
          handleLoginSuccess(data);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
      }

      console.log("Google user:", res);
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  const handleLoginSuccess = async (data) => {
    await Preferences.set({ key: "authToken", value: data.token });
    await Preferences.set({
      key: "authTokenExpiry",
      value: String(Date.now() + 30 * 86400000),
    });
     await Preferences.set({
       key: "user",
       value: JSON.stringify(data.user),
     });

    setUser(data.user);
    setShowUserLogin(false);
    if (cartItems && Object.keys(cartItems).length > 0) {
      setCartItems({
        ...data.user.cartItems,
        ...cartItems,
      });
    }

    if (wishList && wishList.length > 0) {
      const wishListData = Array.from(
        new Set([...data.user.wishList, ...wishList])
      );
      setWishList(wishListData);
    }

    setIsSeller(data.user.isSeller);
    setIsRider(data.user.isRider || false);
    if (location.pathname !== "/seller") navigate("/");
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60"
    >
      <form
        onSubmit={(e) =>
          state !== "forgotPassword" ? onSubmitHandler(e) : sendResetEmail(e)
        }
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-5 w-[90%] max-w-sm p-8 rounded-2xl shadow-2xl border border-gray-200 bg-background  transition-all"
      >
        <p className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          <span className="text-primary">User</span>{" "}
          {state === "login"
            ? "Login"
            : state === "register"
            ? "Sign Up"
            : "Forgot-Password"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 ">Name</label>
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
          <label className="text-sm font-medium text-gray-700 ">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
            placeholder="Email Address"
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200  dark:text-text"
            type="email"
            required
          />
        </div>

        {state !== "forgotPassword" && (
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 ">
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
        {state === "login" && (
          <p
            className="text-sm text-right text-primary hover:underline cursor-pointer -mt-3"
            onClick={() => setState("forgotPassword")}
          >
            Forgot Password?
          </p>
        )}

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
        <div
          ref={googleButtonRef}
          onClick={handleGoogleLogin}
          className="bg-white text-[#3c4043] border border-gray-300 px-6 py-1 rounded shadow hover:shadow-md cursor-pointer transition-all flex items-center space-x-2"
        >
          <img src={assets.googleIcon} alt="Google" className="w-7 h-7" />
          <span className="font-medium">Sign in with Google</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
