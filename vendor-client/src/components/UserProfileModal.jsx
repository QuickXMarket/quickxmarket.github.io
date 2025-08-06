import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";
import { EditEmailModal, ChangePasswordModal } from "./UserSecurityModals";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const DetailRow = ({
  label,
  field,
  editFields,
  formData,
  handleToggleEdit,
  handleChange,
}) => (
  <div className="flex-1">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <div className="flex items-center gap-4">
      {editFields[field] ? (
        <input
          type="text"
          value={formData[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1 mt-1 text-sm outline-primary"
        />
      ) : (
        <p className="mt-1 text-gray-800 text-sm flex-1">
          {formData[field] || "—"}
        </p>
      )}
      <button
        type="button"
        onClick={() => handleToggleEdit(field)}
        className="text-sm text-primary hover:underline"
      >
        {editFields[field] ? "Cancel" : "Edit"}
      </button>
    </div>
  </div>
);

const UserProfileModal = ({ data = {}, onClose }) => {
  const [editFields, setEditFields] = useState({});
  const [formData, setFormData] = useState({ ...data });
  const [isDirty, setIsDirty] = useState(false);
  const { axios } = useCoreContext();
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleToggleEdit = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
    setFormData((prev) => ({ ...prev, [field]: data[field] }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(data));
  }, [formData, data]);

  const handleSave = async () => {
    if (!isDirty) return;

    try {
      setLoading(true);
      const formPayload = {};
      formPayload.name = formData.name;
      // formPayload.append("number", formData.number);

      const { data: response } = await axios.patch(
        "/api/user/edit-profile",
        formPayload
      );

      if (response.success) {
        toast.success("Profile updated successfully");
        setUser(response.user);
        setIsDirty(false);
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
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
        className="w-[90%] max-w-md bg-white rounded-lg shadow-xl p-1 space-y-6"
      >
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
          <div className="font-medium">Profile Details</div>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-black text-xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-5 pb-6">
          <div className="space-y-4">
            <DetailRow
              label="Name"
              field="name"
              editFields={editFields}
              formData={formData}
              handleChange={handleChange}
              handleToggleEdit={handleToggleEdit}
            />

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Email</p>
              <div className="flex items-center gap-4">
                <p className="mt-1 text-gray-800 text-sm flex-1">
                  {formData.email || "—"}
                </p>
                <button
                  type="button"
                  onClick={() => setShowEditEmail(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="flex  gap-3 pt-6">
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full text-sm font-medium border border-primary text-primary rounded py-2 hover:bg-primary/10"
            >
              Change Password
            </button>

            <button
              onClick={() => toast("Delete Account clicked")}
              className="w-full text-sm font-medium border border-red-600 text-red-600 rounded py-2 hover:bg-red-100"
            >
              Delete Account
            </button>
          </div>
          {showEditEmail && (
            <EditEmailModal onClose={() => setShowEditEmail(false)} />
          )}

          {showChangePassword && (
            <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
          )}

          <div className="flex justify-end pt-3">
            <button
              onClick={handleSave}
              disabled={!isDirty || loading}
              className={`px-4 py-2 rounded-md text-white transition-all ${
                isDirty
                  ? "bg-primary hover:bg-primary-dull"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {!loading ? "Save" : "Saving..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
