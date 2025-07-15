// models/Wallet.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["credit", "debit", "withdrawal"],
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    walletType: {
      type: String,
      enum: ["rider", "vendor"],
      required: true,
    },
    balance: { type: Number, default: 0 },
    transactions: [transactionSchema],
  },
  {
    timestamps: true,
  }
);

walletSchema.index({ userId: 1, walletType: 1 }, { unique: true });

const Wallet = mongoose.models.wallet || mongoose.model("wallet", walletSchema);
export default Wallet;
  