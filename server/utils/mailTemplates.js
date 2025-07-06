const userOrderConfirmation = (products, orderId) => {
  let total = 0;
  const websiteDomain = process.env.WEBSITE_URL;

  const productHTML = products
    .map((product) => {
      const { name, quantity, totalPrice, imageUrl, productLink } = product;

      total += totalPrice;

      return `
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <img src="${imageUrl}" alt="${name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
        <div>
          <a href="${productLink}" style="font-weight: bold; color: #007bff; text-decoration: none;">${name}</a>
          <div style="font-size: 14px; color: #555;">Quantity: ${quantity}</div>
          <div style="font-size: 14px; color: #555;">Total: ₦${totalPrice.toLocaleString()}</div>
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
      <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="Company Logo" style="max-height: 60px;" />
    </div>

    <!-- Intro -->
    <h2 style="color: #333;">Your order has been received!</h2>
    <p style="color: #666; font-size: 15px;">
      Thank you for placing an order with <strong>QuickXMarket</strong>. We're notifying the vendors and will update you when they confirm availability and delivery dates.
    </p>

    <!-- Products List -->
    <div style="margin-top: 20px;">
      ${productHTML}
    </div>

    <!-- Total Summary -->
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <div style="text-align: right; font-size: 16px; font-weight: bold; color: #333;">
      Order Total: ₦${total.toLocaleString()}
    </div>

    <!-- Outro -->
 <p style="margin-top: 30px; color: #666; font-size: 14px;">
      Your order ID is <strong>#${orderId}</strong>. You can 
      <a href="https://${websiteDomain}/My-Orders/${orderId}" style="color: #007bff; text-decoration: none;">view it here</a>
      for more details and updates.
    </p>

    <p style="color: #999; font-size: 13px; margin-top: 20px;">
      If you have any questions, just reply to this email. We're happy to help!
    </p>

  </div>
</div>
  `;
};

const vendorOrderNotification = (products, orderId) => {
  let total = 0;
  const websiteDomain = process.env.WEBSITE_URL;

  const productHTML = products
    .map((product) => {
      const { name, quantity, totalPrice, imageUrl, productLink } = product;

      total += totalPrice;

      return `
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <img src="${imageUrl}" alt="${name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
        <div>
          <a href="${productLink}" style="font-weight: bold; color: #007bff; text-decoration: none;">${name}</a>
          <div style="font-size: 14px; color: #555;">Quantity: ${quantity}</div>
          <div style="font-size: 14px; color: #555;">Total: ₦${totalPrice.toLocaleString()}</div>
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
      <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="Company Logo" style="max-height: 60px;" />
    </div>

    <!-- Intro -->
    <h2 style="color: #333;">New Order Notification</h2>
    <p style="color: #666; font-size: 15px;">
      Hello Vendor,<br /><br />
      A new order <strong>(ID: #${orderId})</strong> has been placed that includes one or more of your products. Please review the order details below and confirm the availability and delivery date as soon as possible.
    </p>

    <!-- Products List -->
    <div style="margin-top: 20px;">
      ${productHTML}
    </div>

    <!-- Total Summary -->
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <div style="text-align: right; font-size: 16px; font-weight: bold; color: #333;">
      Total Order Value: ₦${total.toLocaleString()}
    </div>



    <p style="color: #999; font-size: 13px; margin-top: 20px;">
      If you have any issues accessing the vendor dashboard or need assistance, feel free to reach out to the support team.
    </p>

  </div>
</div>
  `;
};

const adminOrderNotification = (products, orderId) => {
  let total = 0;

  const productHTML = products
    .map((product) => {
      const { name, quantity, totalPrice, imageUrl, productLink } = product;

      total += totalPrice;

      return `
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <img src="${imageUrl}" alt="${name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
        <div>
          <a href="${productLink}" style="font-weight: bold; color: #007bff; text-decoration: none;">${name}</a>
          <div style="font-size: 14px; color: #555;">Quantity: ${quantity}</div>
          <div style="font-size: 14px; color: #555;">Total: ₦${totalPrice.toLocaleString()}</div>
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
      <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="Company Logo" style="max-height: 60px;" />
    </div>

    <!-- Intro -->
    <h2 style="color: #333;">New Order Placed</h2>
    <p style="color: #666; font-size: 15px;">
      A customer has just placed an order <strong>(ID: #${orderId})</strong>. The vendors have been notified and will confirm availability shortly.
    </p>

    <!-- Products List -->
    <div style="margin-top: 20px;">
      ${productHTML}
    </div>

    <!-- Total Summary -->
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <div style="text-align: right; font-size: 16px; font-weight: bold; color: #333;">
      Order Total: ₦${total.toLocaleString()}
    </div>

    <!-- Outro -->
  

    <p style="color: #999; font-size: 13px; margin-top: 20px;">
      This is an automated notification to keep you updated on order activity. No action is required unless an issue arises.
    </p>

  </div>
</div>
  `;
};

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

export {
  userOrderConfirmation,
  vendorOrderNotification,
  adminOrderNotification,
  vendorProductUploadConfirmation,
};
