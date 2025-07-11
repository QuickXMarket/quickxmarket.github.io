import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    fcmToken: { type: String, default: null },
    wishList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "product", default: [] },
    ],
    isSeller: { type: Boolean, default: false },
    isRider: { type: Boolean, default: false },
  },
  { minimize: false }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
