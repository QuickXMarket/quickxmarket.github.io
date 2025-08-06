import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetTokens.js";
import { sendResetPasswordEmail } from "./mailController.js";

export const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("_id email");
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "If the email is valid, you'll receive a reset link.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordResetToken.create({
      userId: user._id,
      hashedToken,
      expiresAt,
    });

    const websiteDomain = process.env.WEBSITE_URL;
    const resetLink = `${websiteDomain}/reset-password?token=${rawToken}&id=${user._id}`;
    await sendResetPasswordEmail(email, resetLink);

    return res
      .status(200)
      .json({ success: true, message: "Password reset email sent." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, id, newPassword } = req.body;

    if (!token || !id || !newPassword) {
      return res.json({
        success: false,
        message: "Missing token, user ID, or new password.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const tokenDoc = await PasswordResetToken.findOne({
      userId: id,
      hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!tokenDoc) {
      return res.json({ success: false, message: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    await PasswordResetToken.deleteOne({ _id: tokenDoc._id });

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
