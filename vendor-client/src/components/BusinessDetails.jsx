import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";

const DetailRow = ({
  label,
  field,
  editFields,
  formData,
  suggestions,
  handleToggleEdit,
  handleChange,
  onChange,
  onSuggestionClick,
}) => (
  <div className="flex-1">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <div className="flex items-center gap-4">
      {editFields[field] ? (
        <div className="relative w-full">
          <input
            type={field.includes("Time") ? "time" : "text"}
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, e.target.value, onChange)}
            className="flex-1 w-full border border-gray-300 rounded px-3 py-1 mt-1 text-sm outline-primary"
          />
          {suggestions?.length > 0 && field === "address" && (
            <ul className="absolute z-50 bg-white border border-gray-300 rounded w-full max-h-40 overflow-auto mt-1">
              {suggestions?.map((suggestion) => (
                <li
                  key={suggestion?.place_id}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {`${suggestion?.display_name}, ${suggestion?.street || ""}`}
                </li>
              ))}
            </ul>
          )}
        </div>
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

const BusinessDetails = ({ data = {}, onClose }) => {
  const [editFields, setEditFields] = useState({});
  const [formData, setFormData] = useState({ ...data });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { axios, navigate, fuse, location } = useCoreContext();
  const { setVendor } = useAuthContext();
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleToggleEdit = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
    setFormData((prev) => ({ ...prev, [field]: data[field] }));
  };

  const handleChange = (field, value, onChange) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    onChange && onChange(value);
  };

  useEffect(() => {
    const areEqual = JSON.stringify(formData) === JSON.stringify(data);
    if (!areEqual) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [formData, data]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setUploadPreview(URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      profilePhoto: file,
    }));
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const results = fuse.search(query).slice(0, 5);
      const suggestionsData = results.map((result) => result.item);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to fetch address suggestions");
    } finally {
      setLoading(false);
    }
  };

  const onAddressChange = (value) => {
    fetchSuggestions(value);
  };

  const onSuggestionClick = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      address: `${suggestion.display_name}, ${suggestion.street || ""}`,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
    }));
    setSuggestions([]);
  };

  const onSubmitHandler = async () => {
    const phoneRegex =
      /^(?:\+?234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|911|912|913|915|916)\d{7}$/;

    if (loading) {
      toast.error("Address is still loading, please wait.");
      return;
    }
    if (!formData.businessName || !formData.number || !formData.address) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!phoneRegex.test(formData.number)) {
      toast.error("Please enter a valid Nigerian phone number.");
      return;
    }

    if (formData.latitude === null || formData.longitude === null) {
      toast.error("Please select a valid address from suggestions.");
      return;
    }
    if (formData.openingTime >= formData.closingTime) {
      toast.error("Closing time must be after opening time.");
      return;
    }

    try {
      const vendorData = new FormData();
      vendorData.append("vendorId", data._id);
      vendorData.append("businessName", formData.businessName);
      vendorData.append("number", formData.number);
      vendorData.append("address", formData.address);
      vendorData.append("latitude", formData.latitude);
      vendorData.append("longitude", formData.longitude);
      vendorData.append("openingTime", formData.openingTime);
      vendorData.append("closingTime", formData.closingTime);

      if (typeof formData.profilePhoto !== "string") {
        vendorData.append("profilePhoto", formData.profilePhoto);
      }

      const { data: respData } = await axios.patch(
        "/api/seller/edit",
        vendorData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (respData.success) {
        setVendor(respData.vendor);
        setFormData(respData.vendor);
        toast.success("Details updated successfully.");
        onClose();
        navigate("/dashboard");
      } else {
        toast.error(respData.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const handleSave = () => {
    if (isDirty) {
      onSubmitHandler();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-black/50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-md bg-white rounded-lg shadow-xl p-1 space-y-6"
      >
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
          <div className="font-medium">Business Details</div>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-black text-xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-5 pb-6">
          <div className="flex justify-center">
            <label htmlFor="profilePhoto" className="cursor-pointer">
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={onFileChange}
                hidden
              />
              <img
                src={
                  uploadPreview || formData.profilePhoto || assets.upload_area
                }
                alt="Upload Area"
                className="w-24 h-24 rounded-full object-cover"
              />
            </label>
          </div>

          <div className="space-y-4">
            <DetailRow
              label="Business Name"
              field="businessName"
              editFields={editFields}
              formData={formData}
              handleChange={handleChange}
              handleToggleEdit={handleToggleEdit}
            />

            <DetailRow
              label="Phone Number"
              field="number"
              editFields={editFields}
              formData={formData}
              handleChange={handleChange}
              handleToggleEdit={handleToggleEdit}
            />

            <DetailRow
              label="Address"
              field="address"
              editFields={editFields}
              formData={formData}
              handleChange={handleChange}
              handleToggleEdit={handleToggleEdit}
              suggestions={suggestions}
              onSuggestionClick={onSuggestionClick}
              onChange={onAddressChange}
            />

            <div className="flex items-center gap-4 justify-between">
              <DetailRow
                label="Opening Time"
                field="openingTime"
                editFields={editFields}
                formData={formData}
                handleChange={handleChange}
                handleToggleEdit={handleToggleEdit}
              />
              <DetailRow
                label="Closing Time"
                field="closingTime"
                editFields={editFields}
                formData={formData}
                handleChange={handleChange}
                handleToggleEdit={handleToggleEdit}
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={` p-2 rounded-md text-white transition-all ${
                isDirty
                  ? "bg-primary hover:bg-primary-dull"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {!saving ? "Save" : "Saving..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
