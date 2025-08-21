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