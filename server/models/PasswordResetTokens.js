import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    hashedToken: {
      type: String,
      required: true,
      minlength: 64, 
      maxlength: 128,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, 
    },

    used: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    minimize: false,
    strict: true,
  }
);

const PasswordResetToken =
  mongoose.models.passwordResetToken ||
  mongoose.model("passwordResetToken", passwordResetTokenSchema);

export default PasswordResetToken;
