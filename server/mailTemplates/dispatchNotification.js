import { transporter } from "../controllers/mailController";

const dispatchRecipientNotification = (
  dispatchId,
  deliveryCode,
  customerAddress = {}
) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Header -->
      <h2 style="color: #333;">Your order is on its way!</h2>
      <p style="color: #666; font-size: 15px;">
        Hello ${customerAddress.firstName || "Customer"},<br /><br />
        Your order <strong>(ID: #${dispatchId})</strong> has been dispatched and is on the way to the address below.
      </p>

      <!-- Address -->
      <div style="margin: 20px 0; font-size: 14px; color: #444;">
        <strong>Delivery Address:</strong><br />
        ${customerAddress.address || "No Address Provided"}<br />
        <strong>Phone:</strong> ${customerAddress.phone || "N/A"}
      </div>

      <!-- Products -->
      <!-- Delivery Code -->
      <div style="margin-top: 30px; text-align: center;">
        <div style="font-size: 15px; color: #555; margin-bottom: 8px;">To receive your package, please provide this code:</div>
        <div style="display: inline-block; padding: 12px 24px; background-color: #4fbf8b; color: #fff; font-size: 32px; font-weight: bold; border-radius: 6px; letter-spacing: 1.5px;">
          ${deliveryCode}
        </div>
      </div>

      <!-- Footer -->
      <p style="color: #999; font-size: 13px; margin-top: 30px; text-align: center;">
        Thank you for choosing QuickXMarket. If you have questions, you can reply to this email anytime.
      </p>

    </div>
  </div>
  `;
};

export const sendDispatchDeliveryCode = async (dispatchId, deliveryCode, dropoff) => {
  try {
    await transporter.sendMail({
      from: `"QuickXMarket" <${process.env.SMTP_USER}>`,
      to: dropoff.email,
      subject: `Dispatch Delivery Code - Dispatch #${dispatchId}`,
      html: dispatchRecipientNotification(dispatchId, deliveryCode, dropoff),
    });
  } catch (error) {
    console.error("❌ Error sending dispatch delivery code email:", error);
  }
};

