import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    items: [
      {
        product: { type: String, required: true, ref: "product" },
        quantity: { type: Number, required: true },
        status: { type: String, default: "Order Placed" },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true, ref: "address" },
    paymentType: { type: String, required: true },
    deliveryCode: { type: String },
    isPaid: { type: Boolean, required: true, default: false },
    riderId: { type: String, default: null, ref: "rider" },
    paystackReference: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
