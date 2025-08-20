import mongoose from "mongoose";

const riderRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      immutable: true,
    },
    name: { type: String, required: true },
    number: { type: String, required: true },
    dob: { type: Date, required: true },
    vehicleType: {
      type: String,
      enum: ["Bicycle", "Motorcycle"],
      required: true,
    },
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminRemarks: { type: String },

    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const RiderRequest =
  mongoose.models.riderRequest ||
  mongoose.model("riderRequest", riderRequestSchema);

export default RiderRequest;
