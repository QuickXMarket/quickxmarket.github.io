import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
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
    isOpen: { type: Boolean, default: false },
    openingTime: { type: String },
    closingTime: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
    fcmToken: {
      type: String,
      default: null,
      maxlength: 1024,
      trim: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: { expireAfterSeconds: 60 * 60 * 24 * 30 },
    },
  },
  { timestamps: true }
);
vendorSchema.pre("save", function (next) {
  if (this.isModified("deleted")) {
    if (this.deleted) {
      this.deletedAt = new Date();
    } else {
      this.deletedAt = null;
    }
  }
  next();
});

const Vendor = mongoose.models.vendor || mongoose.model("vendor", vendorSchema);

export default Vendor;
