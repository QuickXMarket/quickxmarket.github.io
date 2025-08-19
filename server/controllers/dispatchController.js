import { sendWhatsappMessage } from "../bots/Whatsapp/client.js";
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
      try {
        await sendPushNotification(
          token,
          "New Dispatch Request",
          "A new dispatch request has been submitted.",
          {
            route: "/rider/dispatches",
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

    if (dispatchData.dropoff.email) {
      await sendDispatchDeliveryCode(dispatch._id, dispatchData.deliveryCode, {
        email: dispatchData.dropoff.email,
        phone: dispatchData.dropoff.phone,
        firstName: dispatchData.dropoff.firstName,
        address: dispatchData.dropoff.address,
      });
    } else {
      const customerMsg = `✅ Your dispatch request has been received. Our riders have been alerted and will soon pick up your package.\n\nTracking ID: ${dispatch._id}`;
      const recipientMsg = `📦 A delivery is on its way to you!\n\nDelivery Code: ${dispatchData.deliveryCode}\nPlease provide this code to the rider upon receiving your package.`;

      sendWhatsappMessage(dispatchData.dropoff.phone, "text", {
        body: recipientMsg,
      });
      sendWhatsappMessage(dispatchData.pickupAddressDetails.phone, "text", {
        body: customerMsg,
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error in createNewDispatch:", err);
    return res.status(500).json({ received: false });
  }
};

export const getDeliveryFee = async (req, res) => {
  try {
    const { latitude1, longitude1, latitude2, longitude2 } = req.body;
    if (!latitude1 || !longitude1 || !latitude2 || !longitude2) {
      return res.json({ success: false, message: "Invalid data" });
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

export const getRiderDispatch = async (req, res) => {
  try {
    const { riderId } = req.params;

    const orders = await Dispatch.find({
      isPaid: true,
      $or: [{ riderId: null }, { riderId }],
      "items.status": { $nin: ["Order Delivered"] },
    })
      .populate("pickupAddress")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateDispatchStatus = async (req, res) => {
  try {
    const { dispatchId, status } = req.body;

    const dispatch = await Dispatch.findById(dispatchId);
    if (!dispatch) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update item statuses conditionally
    dispatch.status = status;

    await dispatch.save();
    res.json({
      success: true,
      message: "Dispatch status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignRiderToDispatch = async (req, res) => {
  try {
    const { dispatchId, riderId } = req.body;

    const dispatch = await Dispatch.findById(dispatchId);
    if (!dispatch) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res
        .status(404)
        .json({ success: false, message: "Rider not found" });
    }

    if (dispatch.riderId) {
      return res.json({
        success: false,
        message: "Order already assigned to a rider",
      });
    }

    dispatch.status = "Order Assigned";
    dispatch.riderId = riderId;
    await dispatch.save();

    rider.orders.push(dispatchId);
    await rider.save();
    res.json({ success: true, message: "Rider added to order successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmDelivery = async (req, res) => {
  try {
    const { dispatchId, code, riderId } = req.body;

    const dispatch = await Dispatch.findById(dispatchId);
    if (!dispatch) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (dispatch.riderId.toString() !== riderId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized rider" });
    }

    if (dispatch.deliveryCode !== code) {
      return res.json({ success: false, message: "Invalid delivery code" });
    }

    dispatch.status = "Order Delivered";

    await dispatch.save();
    res.json({ success: true, message: "Delivery confirmed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
