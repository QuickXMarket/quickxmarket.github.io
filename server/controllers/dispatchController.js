import Dispatch from "../models/Dispatch.js";
import Rider from "../models/Rider.js";
import { calculateDeliveryFee } from "../utils/deliveryService.js";
import { sendPushNotification } from "../utils/fcmService.js";
import { sendDispatchDeliveryCode } from "./mailController.js";

export const createNewDispatch = async (
  res,
  userId,
  reference,
  dispatchData
) => {
  try {
    const existing = await Dispatch.findOne({ paystackReference: reference });
    if (existing) return res.status(200).json({ received: true });

    const dispatch = await Dispatch.create({
      ...dispatchData,
      isPaid: true,
      paystackReference: reference,
    });

    // Notify Riders
    const riders = await Rider.find().populate("userId");
    const riderFcmTokens = riders
      .map((r) => r.userId?.fcmToken)
      .filter(Boolean);

    for (const token of riderFcmTokens) {
      await sendPushNotification(
        token,
        "New Dispatch Request",
        "A new dispatch request has been submitted.",
        {
          route: "/rider/dispatches",
        }
      );
    }

    await sendDispatchDeliveryCode(dispatch._id, dispatchData.deliveryCode, {
      email: dispatchData.dropoff.email,
      phone: dispatchData.dropoff.phone,
      firstName: dispatchData.dropoff.firstName,
      address: dispatchData.dropoff.address,
    });

    res.json({ received: true });
  } catch {
    return res.status(500).json({ received: false });
  }
};

export const getDeliveryFee = async (req, res) => {
  try {
    const { latitude1, longitude1, latitude2, longitude2 } = req.body;
    if (!latitude1 || !longitude1 || !latitude2 || !longitude2) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const deliveryFee = await calculateDeliveryFee(
      latitude1,
      longitude1,
      latitude2,
      longitude2
    );

    return res.json({ success: true, deliveryFee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserDispatch = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Dispatch.find({
      userId,
    })
      .populate("pickupAddress")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
