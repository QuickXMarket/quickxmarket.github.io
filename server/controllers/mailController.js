
import nodemailer from "nodemailer";
import "dotenv/config";
import {
  userOrderConfirmation,
  vendorOrderNotification,
  adminOrderNotification,
  vendorProductUploadConfirmation,
} from "../utils/mailTemplates.js";

// Ensure admin email is set
const adminEmail = process.env.ADMIN_EMAIL;
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
    const attachment = req.file;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, subject, message) are required.",
      });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // use server email in "from"
      to: adminEmail,
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

  
export const sendVendorProductUploadConfirmation = async (vendorEmail, product) => {
  try {
    await transporter.sendMail({
      from: `"YourBrand" <${process.env.SMTP_USER}>`,
      to: vendorEmail,
      subject: `Product Upload Confirmation - ${product.name}`,
      html: vendorProductUploadConfirmation(product),
    });
  } catch (error) {
    console.error("❌ Error sending vendor product upload confirmation email:", error);
  }
};

// Send order-related notifications to admin, vendors, and customer
export const sendOrderNotification = async ({
  orderId,
  products,
  customerEmail,
  vendorEmails,
}) => {
  try {
    // Notify admin
    await transporter.sendMail({
      from: `"YourBrand" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Order Placed - Order #${orderId}`,
      html: adminOrderNotification(products, orderId),
    });

    // Group products by vendorId if needed later
    // For now, all vendors get full order info
    for (const vendorEmail of vendorEmails) {
      await transporter.sendMail({
        from: `"YourBrand" <${process.env.SMTP_USER}>`,
        to: vendorEmail,
        subject: `New Order Notification - Order #${orderId}`,
        html: vendorOrderNotification(products, orderId),
      });
    }

    // Notify customer
    await transporter.sendMail({
      from: `"YourBrand" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - Order #${orderId}`,
      html: userOrderConfirmation(products, orderId),
    });
  } catch (error) {
    console.error("❌ Error sending order notification emails:", error);
  }
};
