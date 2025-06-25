import nodemailer from "nodemailer";
import "dotenv/config";

const adminEmail = process.env.ADMIN_EMAIL;

if (!adminEmail) {
  console.error("ADMIN_EMAIL is not set in environment variables.");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    // Attachment handling if any
    const attachment = req.file;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: adminEmail,
      subject: subject,
      text: message,
      html: `<p>${message}</p><p>From: ${name} (${email})</p>`,
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

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
