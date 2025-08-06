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
