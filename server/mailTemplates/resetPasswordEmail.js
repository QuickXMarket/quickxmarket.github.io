import { transporter } from "../controllers/mailController";

const resetPasswordEmail = (resetLink) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Header -->
      <h2 style="color: #333;">Reset Your Password</h2>
      <p style="color: #666; font-size: 15px;">
        We received a request to reset your password. Click the button below to set a new one. This link is valid for a limited time and can only be used once.
      </p>

      <!-- Reset Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
      </div>

      <p style="color: #666; font-size: 14px;">
        If the button above doesn't work, copy and paste the following link into your browser:
      </p>
      <p style="word-break: break-all; color: #007bff; font-size: 13px;">
        <a href="${resetLink}" style="color: #007bff; text-decoration: none;">${resetLink}</a>
      </p>

      <p style="color: #999; font-size: 13px; margin-top: 20px;">
        If you didn't request a password reset, you can ignore this email or contact us if you're concerned.
      </p>

     
    </div>
  </div>
  `;
};

const sendResetPasswordEmail = async (userEmail, resetLink) => {
  try {
    await transporter.sendMail({
      from: `"QuickXMarket Support" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: "Reset Your QuickXMarket Password",
      html: resetPasswordEmail(resetLink),
    });
  } catch (error) {
    console.error("❌ Error sending reset password email:", error);
  }
};

export default sendResetPasswordEmail();
