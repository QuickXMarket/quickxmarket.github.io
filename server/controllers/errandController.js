import Errand from "../models/Errand.js";
import Rider from "../models/Rider.js";
import { calculateDeliveryFee } from "../utils/deliveryService.js";

export const createNewErrand = async (res, userId, reference, errandData) => {
  try {
    const existing = await Errand.findOne({ paystackReference: reference });
    if (existing) return res.status(200).json({ received: true });

    const errand = await Errand.create({
      ...errandData,
      isPaid: true,
      paystackReference: reference,
    });

    // Notify Riders
    const riders = await Rider.find().populate("userId");
    const riderFcmTokens = riders
      .map((r) => r.userId?.fcmToken)
      .filter(Boolean);

    for (const token of riderFcmTokens) {
      try {
        await sendPushNotification(
          token,
          "New Errand Request",
          "A new errand request has been submitted.",
          {
            route: "/",
          }
        );
      } catch (error) {
        console.error(
          "Error sending notification to token:",
          token,
          error.message
        );
      }
    }

    if (errandData.dropOff.email) {
      await sendDispatchDeliveryCode(errand._id, errandData.errands, {
        email: errandData.dropOff.email,
        phone: errandData.dropOff.phone,
        firstName: errandData.dropOff.firstName,
        address: errandData.dropOff.address,
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error in createNewErrand:", err);
    return res.status(500).json({ received: false });
  }
};

export const getErrandDeliveryFee = async (req, res) => {
  try {
    const { dropOff, errands } = req.body;
    if (!dropOff || !errands) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let totalDeliveryFee = 0;
    for (let i = 0; i < errands.length; i++) {
      const start = errands[i];
      const end = i < errands.length - 1 ? errands[i + 1] : dropOff;

      const deliveryFee = await calculateDeliveryFee(
        start.latitude,
        start.longitude,
        end.latitude,
        end.longitude
      );

      totalDeliveryFee += deliveryFee;
    }

    return res.json({ success: true, totalDeliveryFee });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserErrand = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Errand.find({
      userId,
    })
      .populate("dropOff")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
