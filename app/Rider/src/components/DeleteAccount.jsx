import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";

const DeleteAccountModal = ({ onClose }) => {
  const { makeRequest } = useCoreContext();
  const { logout } = useAuthContext();
  const [form, setForm] = useState({
    password: "",
    confirmation: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.password || !form.confirmation) {
      toast.error("Please enter your password and confirm the action");
      return;
    }

    try {
      setLoading(true);
      const data = await makeRequest({
        url: "/api/user/deleteAccount",
        method: "POST",
        data: form,
      });
      if (data.success) {
        toast.success("Account scheduled for deletion");
        logout();
        setForm({ password: "", confirmation: false });
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
          <div className="font-medium text-base">Delete Account</div>
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
            <p className="text-sm text-gray-700">
              Deleting your account is permanent and will result in the loss of
              all accounts and data associated with it, including any vendor or
              rider profiles linked to this user. Please confirm your password
              and acknowledge this action to proceed.
            </p>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
              />
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={form.confirmation}
                required
                onChange={(e) => handleChange("confirmation", e.target.checked)}
                id="confirmDeletion"
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label
                htmlFor="confirmDeletion"
                className="ml-2 text-sm text-gray-700"
              >
                I understand this action is permanent
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading || !form.confirmation}
                className={`w-full py-2 text-sm font-medium text-white rounded-md transition-all ${
                  form.confirmation
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Deleting Account..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
