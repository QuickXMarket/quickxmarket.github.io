import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { axios, navigate, location } = useCoreContext();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/\d/.test(password)) errors.push("one number");
    if (!/[@$!%*?&#^()[\]{}|\\/<>"'=+~`_\-.,;:]/.test(password))
      errors.push("one special character");
    return errors;
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const newPasswordErrors = validatePassword(newPassword);
      const confirmPasswordErrors = [];

      if (newPassword !== confirmPassword) {
        confirmPasswordErrors.push("Passwords do not match");
      }

      const validationErrors = {};
      if (newPasswordErrors.length > 0) {
        validationErrors.newPassword = newPasswordErrors;
      }
      if (confirmPasswordErrors.length > 0) {
        validationErrors.confirmPassword = confirmPasswordErrors;
      }

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        const { data } = await axios.post(`/api/user/resetPassword`, {
          id,
          token,
          newPassword,
        });
        if (data.success) {
          toast.success(data.message);
          setNewPassword("");
          setConfirmPassword("");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white max-w-md w-full p-8 rounded-lg shadow-xl border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
          Reset Password
        </h2>

        <div className="mb-4">
          <label htmlFor="newPassword" className="block mb-1 font-medium">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className={`w-full p-2 border rounded outline-primary ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.newPassword && errors.newPassword.length > 0 && (
            <ul className="mt-1 ml-1 text-xs text-red-600 space-y-0.5">
              {errors.newPassword.map((err, index) => (
                <li key={index}>• {err}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={`w-full p-2 border rounded outline-primary ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            required
          />

          {errors.confirmPassword && errors.confirmPassword.length > 0 && (
            <ul className="mt-1 ml-1 text-xs text-red-600 space-y-0.5">
              {errors.confirmPassword.map((err, index) => (
                <li key={index}>• {err}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dull transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
