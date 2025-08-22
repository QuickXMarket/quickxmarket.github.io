import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      immutable: true,
    },
    profilePhoto: { type: String, required: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    dob: { type: Date, required: true },
    vehicleType: {
      type: String,
      enum: ["Bicycle", "Motorcycle"],
      required: true,
    },
    ninImageHash: {
      iv: { type: String, required: true },
      content: { type: String, required: true },
    },
    fcmToken: {
      type: String,
      default: null,
      maxlength: 1024,
      trim: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
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
  {
    minimize: false,
    timestamps: true,
    strict: true,
  }
);
riderSchema.pre("save", function (next) {
  if (this.isModified("deleted")) {
    if (this.deleted) {
      this.deletedAt = new Date();
    } else {
      this.deletedAt = null;
    }
  }
  next();
});
const Rider = mongoose.models.rider || mongoose.model("rider", riderSchema);

export default Rider;
