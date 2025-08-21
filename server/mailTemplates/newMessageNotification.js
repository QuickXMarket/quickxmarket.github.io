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