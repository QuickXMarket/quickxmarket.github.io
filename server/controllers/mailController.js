import nodemailer from "nodemailer";
import "dotenv/config";
import {
  userOrderConfirmation,
  vendorOrderNotification,
  adminOrderNotification,
  vendorProductUploadConfirmation,
  riderOrderNotification,
  dispatchRecipientNotification,
  newMessageNotification,
  resetPasswordEmail,
  vendorRequestConfirmation,
  vendorRequestResponseNotification,
} from "../utils/mailTemplates.js";

// Ensure admin email is set
const adminEmail = process.env.ADMIN_EMAIL;
const supportEmail = process.env.SUPPORT_EMAIL;
if (!adminEmail) {
  console.error("❌ ADMIN_EMAIL is not set in environment variables.");
}

// Setup mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send a general contact message to the admin
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    let attachment = null;
    if (req.file) attachment = req.file;
    else if (
      req.body.attachment?.base64 &&
      req.body.attachment?.base64.startsWith("data:")
    ) {
      const base64Data = req.body.attachment.base64.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      attachment = {
        originalname: req.body.attachment.name,
        buffer,
      };
    }

    if (!name || !email || !subject || !message) {
      return res.json({
        success: false,
        message: "All fields (name, email, subject, message) are required.",
      });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: supportEmail,
      subject,
      text: message,
      html: `<p>${message}</p><p><strong>From:</strong> ${name} (${email})</p>`,
      replyTo: email,
    };

    if (attachment) {
      mailOptions.attachments = [
        {
          filename: attachment.originalname,
          content: attachment.buffer,
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error("❌ Error sending contact email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

export const sendVendorProductUploadConfirmation = async (
  vendorEmail,
  product
) => {
  try {
    await transporter.sendMail({
      from: `"QuickXMarket" <${process.env.SMTP_USER}>`,
      to: vendorEmail,
      subject: `Product Upload Confirmation - ${product.name}`,
      html: vendorProductUploadConfirmation(product),
    });
  } catch (error) {
    console.error(
      "❌ Error sending vendor product upload confirmation email:",
      error
    );
  }
};

// Send order-related notifications to admin, vendors, and customer
export const sendOrderNotification = async ({
  orderId,
  products,
  customerEmail,
  customerAddress,
  vendorEmails,
  riderEmails,
}) => {
  try {
    // Notify admin
    await transporter.sendMail({
      from: `"QuickXMarket" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Order Placed - Order #${orderId}`,
      html: adminOrderNotification(products, orderId),
    });

    // Group products by vendorId if needed later
    // For now, all vendors get full order info
    for (const vendorEmail of vendorEmails) {
      await transporter.sendMail({
        from: `"QuickXMarket" <${process.env.SMTP_USER}>`,
        to: vendorEmail,
        subject: `New Order Notification - Order #${orderId}`,
        html: vendorOrderNotification(products, orderId),
      });
    }

    for (const riderEmail of riderEmails) {
      await transporter.sendMail({
        from: `"QuickXMarket" <${process.env.SMTP_USER}>`,
        to: riderEmail,
        subject: `New Delivery Request - Order #${orderId}`,
        html: riderOrderNotification(products, orderId, customerAddress),
      });
    }

    // Notify customer
    await transporter.sendMail({
      from: `"QuickXMarket" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - Order #${orderId}`,
      html: userOrderConfirmation(products, orderId),
    });
  } catch (error) {
    console.error("❌ Error sending order notification emails:", error);
  }
};

export const sendDispatchDeliveryCode = async (
  dispatchId,
  deliveryCode,
  dropoff
) => {
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

export const sendNewMessageNotification = async ({
  recipientEmail,
  senderName,
  messageText,
  mediaUrl,
}) => {
  try {
    await transporter.sendMail({
      from: `"QuickXMarket" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `New Message from ${senderName}`,
      html: newMessageNotification({ senderName, messageText, mediaUrl }),
    });
  } catch (error) {
    console.error("❌ Error sending new message notification email:", error);
  }
};

export const sendResetPasswordEmail = async (userEmail, resetLink) => {
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
