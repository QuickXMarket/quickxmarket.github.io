import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    number: { type: String, required: true },
    dob: { type: Date, required: true },
    vehicleType: {
      type: String,
      enum: ["bicycle", "motorcycle"],
      required: true,
    },
  },
  { timestamps: true }
);

const Rider = mongoose.models.rider || mongoose.model("rider", riderSchema);

export default Rider;
