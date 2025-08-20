import mongoose from "mongoose";

const errandsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String },
    deliveryNote: { type: String },
  },
  { _id: false }
);

const errandSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    dropOff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      immutable: true,
    },
    dropOffDetails: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    errands: { type: [errandsSchema], required: true },
    isExpress: { type: Boolean, default: false },
    deliveryFee: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    totalFee: { type: Number, required: true },
    riderId: { type: String, ref: "rider", default: null },
    status: {
      type: String,
      enum: [
        "Order Placed",
        "Order Assigned",
        "Order Picked",
        "Order Delivered",
        "Order Cancelled",
      ],
      default: "Order Placed",
    },
    isPaid: { type: Boolean, default: false },
    paymentType: { type: String, required: true },
    paystackReference: { type: String, unique: true, sparse: true },
    deliveryCode: { type: String, required: true },
  },
  { timestamps: true }
);

const Errand = mongoose.models.errand || mongoose.model("errand", errandSchema);

export default Errand;
