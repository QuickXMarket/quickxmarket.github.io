import { transporter } from "../controllers/mailController";

const riderRequestConfirmation = (name) => {
  const websiteDomain = process.env.WEBSITE_URL;

  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Header -->
      <h2 style="color: #333;">Rider Registration Request Sent</h2>
      <p style="color: #666; font-size: 15px;">
        Hello <strong>${name}</strong>,<br /><br />
        We have received your rider registration request. 
        Our admin team will review your details and notify you once your application has been approved or if we need more information.
      </p>

      <!-- Next Steps -->
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        You’ll receive further instructions by email once your registration has been processed.  
        In the meantime, you can learn more about QuickXMarket on 
        <a href="https://${websiteDomain}" style="color: #007bff; text-decoration: none;">our website</a>.
      </p>

      <!-- Footer -->
      <p style="color: #999; font-size: 13px; margin-top: 30px;">
        If you have any questions about your registration, please reply to this email or 
        contact our <a href="https://${websiteDomain}/contact" style="color: #007bff; text-decoration: none;">support team</a>.
      </p>

    </div>
  </div>
  `;
};

const riderRequestResponseNotification = (name, approved, remarks) => {
  const websiteDomain = process.env.WEBSITE_URL;

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
      <h2 style="color: #333;">Rider Registration Request Update</h2>
      <p style="color: #666; font-size: 15px;">
        Hello <strong>${name}</strong>,<br /><br />
        Your rider registration request has been reviewed by our admin team.
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
            ? `You can now log in to the <strong>QuickXMarket Rider App</strong> and start accepting delivery requests.`
            : `If you have questions about the decision or would like to reapply, please contact our <a href="https://${websiteDomain}/contact" style="color: #007bff; text-decoration: none;">support team</a>.`
        }
      </p>

      <!-- Footer -->
      <p style="color: #999; font-size: 13px; margin-top: 30px;">
        If you have any questions about your registration, please reply to this email or 
        contact our <a href="https://${websiteDomain}/contact" style="color: #007bff; text-decoration: none;">support team</a>.
      </p>

    </div>
  </div>
  `;
};

export const sendRiderRequestConfirmation = async (userEmail, name) => {
  try {
    await transporter.sendMail({
      from: `"QuickXMarket Rider Onboarding" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: "Rider Registration Request Received",
      html: riderRequestConfirmation(name),
    });
  } catch (error) {
    console.error("❌ Error sending rider request confirmation email:", error);
  }
};

export const sendRiderRequestResponseNotif = async (
  userEmail,
  name,
  approved,
  remarks
) => {
  try {
    await transporter.sendMail({
      from: `"QuickXMarket Rider Onboarding" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Rider Registration ${approved ? "Approved" : "Declined"}`,
      html: riderRequestResponseNotification(name, approved, remarks),
    });
  } catch (error) {
    console.error("❌ Error sending rider request response email:", error);
  }
};
