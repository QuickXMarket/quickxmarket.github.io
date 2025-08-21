const userErrandOrderConfirmation = (errands, orderId, customer = {}) => {
  const websiteDomain = process.env.WEBSITE_URL;

  const errandsHTML = errands
    .map((errand, index) => {
      const { name, address, phone, deliveryNote } = errand;

      return `
      <div style="border: 1px solid #eee; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
        <div style="font-weight: bold; color: #333;">${index + 1}. ${name}</div>
        <div style="font-size: 14px; color: #555; margin-top: 5px;">
          <strong>Address:</strong> ${address || "No address provided"}<br />
          <strong>Phone:</strong> ${
            phone
              ? `<a href="tel:${phone}" style="color: #555; text-decoration: none;">${phone}</a>`
              : "N/A"
          }<br />
          ${deliveryNote ? `<strong>Note:</strong> ${deliveryNote}` : ""}
        </div>
      </div>
      `;
    })
    .join("");

  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Intro -->
      <h2 style="color: #333;">Your errand request has been received!</h2>
      <p style="color: #666; font-size: 15px;">
        Hello ${customer.firstName || "Customer"},<br /><br />
        We've received your errand order <strong>#${orderId}</strong>. Our riders have been notified and will begin handling your errands shortly. Here are the details:
      </p>

      <!-- Errands List -->
      <div style="margin-top: 20px;">
        ${errandsHTML}
      </div>

      <!-- Footer -->
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        You can <a href="https://${websiteDomain}/Errand/${orderId}" style="color: #007bff; text-decoration: none;">view your order</a> anytime for updates.
      </p>

      <p style="color: #999; font-size: 13px; margin-top: 20px;">
        If you have any questions, just reply to this email. We're happy to help!
      </p>

    </div>
  </div>
  `;
};