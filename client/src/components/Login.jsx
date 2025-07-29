import React from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";
import { useProductContext } from "../context/ProductContext";

const Login = () => {
  const { setShowUserLogin, setUser, setIsSeller } = useAuthContext();
  const { axios, navigate, location } = useCoreContext();
  const { setCartItems, setWishList, wishList, cartItems } =
    useProductContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordErrors, setPasswordErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

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
        }
        setPasswordErrors(errors);
        return;
      }
      const payload = { name, email: email.toLowerCase(), password };

      const { data } = await axios.post(`/api/user/${state}`, payload);
      if (data.success) {
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
        if (location.pathname !== "/seller") navigate("/");
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
      const { data } = await axios.post(`/api/user/sendPasswordResetEmail`, {
        email,
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

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={(e) =>
          state !== "forgotPassword" ? onSubmitHandler(e) : sendResetEmail(e)
        }
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto  p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login"
            ? "Login"
            : state === "register"
            ? "Sign Up"
            : "Forgot-Password"}
        </p>
        {state === "register" && (
          <>
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Full Name"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:ring-primary"
                type="text"
                required
              />
            </div>
          </>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email Address"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:ring-primary"
            type="email"
            required
          />
        </div>
        {state !== "forgotPassword" && (
          <div className="w-full ">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              className={`border border-gray-200 rounded w-full p-2 mt-1 outline-primary  ${
                passwordErrors.length
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }  `}
              type="password"
              required
              autoComplete="current-password"
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
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
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
