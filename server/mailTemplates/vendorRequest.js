import { transporter } from "../controllers/mailController.js";

const vendorRequestConfirmation = (businessName) => {
  const websiteDomain = process.env.WEBSITE_URL;
  const vendorDomain = process.env.VENDOR_URL;

  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Header -->
      <h2 style="color: #333;">Vendor Registration Request Sent</h2>
      <p style="color: #666; font-size: 15px;">
        Hello,<br /><br />
        We have received your vendor registration request for <strong>${businessName}</strong>. 
        Our admin team will review your details and notify you once your application has been approved or if we need more information.
      </p>

      <!-- Next Steps -->
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        You can check your request status anytime by logging into your account on 
        <a href="https://${vendorDomain}" style="color: #007bff; text-decoration: none;">QuickXMarket</a>.
      </p>

      <!-- Footer -->
      <p style="color: #999; font-size: 13px; margin-top: 30px;">
        If you have any questions about your registration, please reply to this email or 
        contact our <a href="https://${vendorDomain}/Contact" style="color: #007bff; text-decoration: none;">support team</a>.
      </p>

    </div>
  </div>
  `;
};

const vendorRequestResponseNotification = (businessName, approved, remarks) => {
  const websiteDomain = process.env.WEBSITE_URL;
  const vendorDomain = process.env.VENDOR_URL;

  const statusColor = approved ? "#28a745" : "#dc3545";

  const statusText = approved ? "Approved" : "Rejected";

  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Header -->
      <h2 style="color: #333;">Vendor Registration Request Update</h2>
      <p style="color: #666; font-size: 15px;">
        Hello,<br /><br />
        Your vendor registration request for <strong>${businessName}</strong> has been reviewed by our admin team.
      </p>

      <!-- Status -->
      <div style="background-color: ${statusColor}20; padding: 15px; border-left: 5px solid ${statusColor}; margin-top: 20px; border-radius: 4px;">
        <strong style="color: ${statusColor}; font-size: 16px;">Status: ${statusText}</strong>
        ${
          remarks
            ? `<p style="margin: 8px 0 0; color: #555; font-size: 14px;">Remarks: ${remarks}</p>`
            : ""
        }
      </div>

      <!-- Next Steps -->
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        ${
          approved
            ? `You can now log in to your vendor dashboard and start setting up your store on <a href="https://${vendorDomain}" style="color: #007bff; text-decoration: none;">QuickXMarket</a>.`
            : `If you have questions about the decision or would like to reapply, please contact our <a href="https://${vendorDomain}/contact" style="color: #007bff; text-decoration: none;">support team</a>.`
        }
      </p>

      <!-- Footer -->
      <p style="color: #999; font-size: 13px; margin-top: 30px;">
        If you have any questions about your registration, please reply to this email or 
        contact our <a href="https://${vendorDomain}/contact" style="color: #007bff; text-decoration: none;">support team</a>.
      </p>

    </div>
  </div>
  `;
};

export const sendVendorRequestConfirmation = async (
  userEmail,
  businessName
) => {
  try {
    await transporter.sendMail({
      from: `"QuickXMarket Vendor Onboarding" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: "Vendor Registration Request Received",
      html: vendorRequestConfirmation(businessName),
    });
  } catch (error) {
    console.error("❌ Error sending vendor request confirmation email:", error);
  }
};

export const sendVendorRequestResponseNotif = async (
  userEmail,
  businessName,
  approved,
  remarks
) => {
  try {
    await transporter.sendMail({
      from: `"QuickXMarket Vendor Onboarding" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Vendor Registration ${approved ? "Approved" : "Declined"}`,
      html: vendorRequestResponseNotification(businessName, approved, remarks),
    });
  } catch (error) {
    console.error("❌ Error sending vendor request response email:", error);
  }
};
