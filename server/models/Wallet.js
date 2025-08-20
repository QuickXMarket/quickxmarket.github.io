import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["credit", "debit", "withdrawal"],
    required: true,
    trim: true,
    lowercase: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Transaction amount must be non-negative"],
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

transactionSchema.set("strict", true);

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      immutable: true,
    },
    walletType: {
      type: String,
      enum: ["rider", "vendor"],
      required: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance must be non-negative"],
    },
    transactions: {
      type: [transactionSchema],
      validate: {
        validator: function (txs) {
          return Array.isArray(txs) && txs.length <= 1000;
        },
        message: "Exceeded maximum transaction history limit.",
      },
    },

    pin: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

walletSchema.index({ userId: 1, walletType: 1 }, { unique: true });

walletSchema.set("strict", true);

const Wallet = mongoose.models.wallet || mongoose.model("wallet", walletSchema);
export default Wallet;
