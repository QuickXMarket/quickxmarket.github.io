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

const riderOrderNotification = (products, orderId, customerAddress = {}) => {
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
          <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
        </div>
    
        <!-- Header -->
        <h2 style="color: #333;">New Delivery Request</h2>
        <p style="color: #666; font-size: 15px;">
          Hello Rider,<br /><br />
          A new order <strong>(ID: #${orderId})</strong> has been placed and is ready for delivery. Below are the details of the items and customer.
        </p>
    
        <!-- Customer Info -->
        <div style="margin: 20px 0; font-size: 14px; color: #444;">
          <strong>Customer:</strong> ${customerAddress.firstName || ""} ${
    customerAddress.lastName || ""
  }<br />
          <strong>Phone:</strong> ${
            customerAddress.phone
              ? `<a href="tel:${customerAddress.phone}" style="color: #444; text-decoration: none;">${customerAddress.phone}</a>`
              : "N/A"
          }<br />
          <strong>Address:</strong> ${
            customerAddress.address || "No Address Provided"
          }
        </div>
    
        <!-- Product List -->
        <div style="margin-top: 20px;">
          ${productHTML}
        </div>
    
        <!-- Total -->
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <div style="text-align: right; font-size: 16px; font-weight: bold; color: #333;">
          Total Order Value: ₦${total.toLocaleString()}
        </div>
    
        <!-- Footer -->
        <p style="color: #999; font-size: 13px; margin-top: 20px;">
          Please open your rider dashboard to accept or view the order.
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

const dispatchRecipientNotification = (
  dispatchId,
  deliveryCode,
  customerAddress = {}
) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Header -->
      <h2 style="color: #333;">Your order is on its way!</h2>
      <p style="color: #666; font-size: 15px;">
        Hello ${customerAddress.firstName || "Customer"},<br /><br />
        Your order <strong>(ID: #${dispatchId})</strong> has been dispatched and is on the way to the address below.
      </p>

      <!-- Address -->
      <div style="margin: 20px 0; font-size: 14px; color: #444;">
        <strong>Delivery Address:</strong><br />
        ${customerAddress.address || "No Address Provided"}<br />
        <strong>Phone:</strong> ${customerAddress.phone || "N/A"}
      </div>

      <!-- Products -->
      <!-- Delivery Code -->
      <div style="margin-top: 30px; text-align: center;">
        <div style="font-size: 15px; color: #555; margin-bottom: 8px;">To receive your package, please provide this code:</div>
        <div style="display: inline-block; padding: 12px 24px; background-color: #4fbf8b; color: #fff; font-size: 32px; font-weight: bold; border-radius: 6px; letter-spacing: 1.5px;">
          ${deliveryCode}
        </div>
      </div>

      <!-- Footer -->
      <p style="color: #999; font-size: 13px; margin-top: 30px; text-align: center;">
        Thank you for choosing QuickXMarket. If you have questions, you can reply to this email anytime.
      </p>

    </div>
  </div>
  `;
};

const newMessageNotification = ({ senderName, messageText, mediaUrl }) => {
  const websiteDomain = process.env.WEBSITE_URL;
  const chatLink = `https://${websiteDomain}?contact=true`;
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Header -->
      <h2 style="color: #333;">You've received a new message!</h2>

      <!-- Sender -->
      <p style="color: #666; font-size: 15px;">
        <strong>${senderName}</strong> sent you a new message:
      </p>

      ${
        mediaUrl
          ? `<div style="text-align: center; margin-bottom: 20px;">
              <img src="${mediaUrl}" alt="Attached Image" style="max-width: 100%; border-radius: 6px;" />
            </div>`
          : ""
      }

      <!-- Message Box -->
   ${
     messageText
       ? ` <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; font-size: 14px; color: #444; margin: 15px 0; border-radius: 4px;">
        ${messageText}
      </div>`
       : ""
   }


      <!-- Chat Link -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="${chatLink}" style="background-color: #007bff; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          View Message
        </a>
      </div>

      <!-- Footer -->
      <p style="color: #999; font-size: 13px; margin-top: 30px; text-align: center;">
        If you have any questions, just reply to this email. We're happy to help!
      </p>
    </div>
  </div>
  `;
};

const resetPasswordEmail = (resetLink) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/quickxmarket/image/upload/v1751029252/QuickXMarket_Logo_Transparent_ym6zl9.png" alt="QuickXMarket Logo" style="max-height: 60px;" />
      </div>

      <!-- Header -->
      <h2 style="color: #333;">Reset Your Password</h2>
      <p style="color: #666; font-size: 15px;">
        We received a request to reset your password. Click the button below to set a new one. This link is valid for a limited time and can only be used once.
      </p>

      <!-- Reset Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
      </div>

      <p style="color: #666; font-size: 14px;">
        If the button above doesn't work, copy and paste the following link into your browser:
      </p>
      <p style="word-break: break-all; color: #007bff; font-size: 13px;">
        <a href="${resetLink}" style="color: #007bff; text-decoration: none;">${resetLink}</a>
      </p>

      <p style="color: #999; font-size: 13px; margin-top: 20px;">
        If you didn't request a password reset, you can ignore this email or contact us if you're concerned.
      </p>

     
    </div>
  </div>
  `;
};

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

export {
  userOrderConfirmation,
  vendorOrderNotification,
  adminOrderNotification,
  vendorProductUploadConfirmation,
  riderOrderNotification,
  dispatchRecipientNotification,
  newMessageNotification,
  resetPasswordEmail,
  vendorRequestConfirmation,
};
