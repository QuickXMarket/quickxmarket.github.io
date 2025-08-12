import mongoose from "mongoose";

const vendorRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      immutable: true,
    },
    profilePhoto: { type: String },
    businessName: { type: String, required: true },
    number: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    openingTime: { type: String },
    closingTime: { type: String },
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminRemarks: { type: String }, 
  },
  { timestamps: true }
);

const VendorRequest =
  mongoose.models.vendorRequest ||
  mongoose.model("vendorRequest", vendorRequestSchema);

export default VendorRequest;
