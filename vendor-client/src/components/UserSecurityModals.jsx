import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";

const ModalWrapper = ({ title, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-md bg-white rounded-lg shadow-xl p-1 space-y-6"
      >
        {/* <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold"></h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            &times;
          </button>
        </div> */}

        <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
          <div className="font-medium">{title}</div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-5 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;

export const EditEmailModal = ({ onClose }) => {
  const { axios } = useCoreContext();
  const { setUser } = useAuthContext();
  const [form, setForm] = useState({
    oldEmail: "",
    newEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.oldEmail || !form.newEmail || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.patch("/api/user/edit-email", form);
      if (data.success) {
        toast.success("Email updated successfully");
        setUser(data.user);
        setForm({ oldEmail: "", newEmail: "", password: "" });
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper title="Change Email" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Old Email</label>
          <input
            type="email"
            value={form.oldEmail}
            onChange={(e) => handleChange("oldEmail", e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">New Email</label>
          <input
            type="email"
            value={form.newEmail}
            onChange={(e) => handleChange("newEmail", e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dull disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const ChangePasswordModal = ({ onClose }) => {
  const { axios } = useCoreContext();
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
      const { data } = await axios.patch("/api/user/change-password", form);
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
    <ModalWrapper title="Change Password" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            value={form.oldPassword}
            onChange={(e) => handleChange("oldPassword", e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
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
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dull disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const DeleteAccountModal = ({ onClose }) => {
  const { axios } = useCoreContext();
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
      const { data } = await axios.post("/api/user/deleteAccount", form);
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
    <ModalWrapper title="Delete Account" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Deleting your account is permanent and will result in the loss of all
          accounts and data associated with it, including any vendor or rider
          profiles linked to this user. Please confirm your password and
          acknowledge this action to proceed.
        </p>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
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
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
