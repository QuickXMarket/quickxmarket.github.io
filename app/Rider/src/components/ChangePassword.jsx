import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";

const ChangePasswordModal = ({ onClose }) => {
  const { makeRequest } = useCoreContext();
  const { setUser } = useAuthContext();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const data = await makeRequest({
        url: "/api/user/change-password",
        method: "PATCH",
        data: form,
      });
      if (data.success) {
        toast.success("Password changed successfully");
        setUser(data.user);
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-md bg-background rounded-lg shadow-xl p-1 space-y-6"
      >
        <div className="flex items-center justify-between px-4 py-2 bg-background border-b">
          <div className="font-medium text-base">Change Password</div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-5 pb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Old Password
              </label>
              <input
                type="password"
                value={form.oldPassword}
                onChange={(e) => handleChange("oldPassword", e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dull transition-all"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
