import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const {
    setShowUserLogin,
    setUser,
    makeRequest,
    navigate,
    location,
    fetchSeller,
    setCartItems,
    setWishList,
    wishList,
    cartItems,
    Preferences
  } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("customer");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format.");
        return;
      }

      const payload = { name, email: email.toLowerCase(), password };
      if (state === "register") {
        payload.role = role;
      }

      const data = await makeRequest({
        method: "POST",
        url: `/api/user/${state}`,
        data: payload,
      });

      if (data.success) {
        setUser(data.user);
        await Preferences.set({ key: "authToken", value: data.token });
        setShowUserLogin(false);
        if (cartItems && Object.keys(cartItems).length > 0) {
          setCartItems({
            ...data.user.cartItems,
            ...cartItems,
          });
        }

        if (wishList && wishList.length > 0) {
          let wishListData = structuredClone(wishList);
          if(data.user.wishList && data.user.wishList.length > 0)
          wishListData = wishListData.filter(
            (item) => !data.user.wishList.includes(item)
          );
          wishListData = [...data.user.wishList, ...wishListData];
          setWishList(wishListData);
        }

        fetchSeller();
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
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <>
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Full Name"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="text"
                required
              />
            </div>
            {/* <div className="w-full">
                    <p>User Type</p>
                    <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="role" value="customer" checked={role === "customer"} onChange={(e) => setRole(e.target.value)} />
                            Customer
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="role" value="vendor" checked={role === "vendor"} onChange={(e) => setRole(e.target.value)} />
                            Vendor
                        </label>
                    </div>
                </div> */}
          </>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email Address"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>
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
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
