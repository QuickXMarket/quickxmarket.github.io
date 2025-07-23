import mongoose from "mongoose";

const dispatchSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    pickupAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
    dropoff: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    deliveryNote: { type: String },
    isExpress: { type: Boolean, default: false },
    deliveryFee: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    totalFee: { type: Number, required: true },
    riderId: { type: String, ref: "rider", default: null },
    status: {
      type: String,
      enum: ["pending", "assigned", "picked", "delivered", "cancelled"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
    paymentType: { type: String, enum: ["cash", "card"], required: true },
    paystackReference: { type: String, unique: true, sparse: true },
    deliveryCode: { type: String, required: true },
  },
  { timestamps: true }
);

const Dispatch =
  mongoose.models.dispatch || mongoose.model("dispatch", dispatchSchema);

export default Dispatch;
