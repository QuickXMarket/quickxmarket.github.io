import nodemailer from "nodemailer";
import "dotenv/config";

// Ensure admin email is set
export const adminEmail = process.env.ADMIN_EMAIL;
export const supportEmail = process.env.SUPPORT_EMAIL;
if (!adminEmail) {
  console.error("❌ ADMIN_EMAIL is not set in environment variables.");
}

// Setup mail transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    let attachment = null;
    if (req.file) attachment = req.file;
    else if (req.body.attachment && req.body.attachment.startsWith("data:")) {
      const [header, base64Data] = req.body.attachment.split(",");
      const buffer = Buffer.from(base64Data, "base64");

      const mimeMatch = header.match(/data:(.*);base64/);
      const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

      let extension = "";
      if (mimeType === "image/png") extension = "png";
      else if (mimeType === "image/jpeg") extension = "jpg";
      else if (mimeType === "application/pdf") extension = "pdf";
      else extension = "bin";

      attachment = {
        originalname: `attachment.${extension}`,
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
