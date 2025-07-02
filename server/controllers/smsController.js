import africasTalkingConfig from "../configs/africastalking.js";

const africasTalking = africasTalkingConfig();
const sms = africasTalking.SMS;

export const sendSMS = async (req, res) => {
  try {
    const { to, message } = req.body;
    const response = await sms.send({
      to,
      message,
    })
    console.log(
      "SMS sent successfully:",
      response.SMSMessageData.Recipients,
      to
    );
    res
      .status(200)
      .json({ success: true, message: "SMS sent successfully", response });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ success: false, message: error.message });
    throw error;
  }
};
