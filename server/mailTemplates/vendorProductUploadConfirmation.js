import { transporter } from "../controllers/mailController";

const vendorProductUploadConfirmation = (product) => {
  const websiteDomain = process.env.WEBSITE_URL;
  const productLink = `${websiteDomain}/products/${product.category}/${product._id}`;

  return `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="Company Logo" style="max-height: 60px;" />
    </div>

    <!-- Intro -->
    <h2 style="color: #333;">Product Upload Confirmation</h2>
    <p style="color: #666; font-size: 15px;">
      Hello Vendor,<br /><br />
      Your product <strong>${product.name}</strong> has been successfully uploaded.
    </p>

    <p style="color: #666; font-size: 15px;">
      You can view your product <a href="${productLink}" style="color: #007bff; text-decoration: none;">here</a>.
    </p>

    <p style="color: #999; font-size: 13px; margin-top: 20px;">
      If you have any questions, just reply to this email or feel free to contact <a href="${websiteDomain}/Contact" style="color: #007bff; text-decoration: none;">support</a>. We're happy to help!
    </p>

  </div>
</div>
  `;
};

const sendVendorProductUploadConfirmation = async (vendorEmail, product) => {
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

export default sendVendorProductUploadConfirmation();
