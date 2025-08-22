import { sendErrandConfirmation } from "../mailTemplates/errandNotification.js";
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
    const riders = await Rider.find();
    const riderFcmTokens = riders.map((r) => r.fcmToken).filter(Boolean);

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
      await sendErrandConfirmation(errand._id, errandData.errands, {
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
    const orders = await Errand.find({ userId })
      .populate("dropOff")
      .populate({
        path: "riderId",
        select: "name number vehicleType",
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRiderErrand = async (req, res) => {
  try {
    const { riderId } = req.params;

    const orders = await Errand.find({
      isPaid: true,
      $or: [{ riderId: null }, { riderId }],
      "items.status": { $nin: ["Order Delivered"] },
    })
      .populate("dropOff")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateErrandStatus = async (req, res) => {
  try {
    const { errandId, status } = req.body;

    const errand = await Errand.findById(errandId);
    if (!errand) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update item statuses conditionally
    errand.status = status;

    await errand.save();
    res.json({
      success: true,
      message: "Errand status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignRiderToErrand = async (req, res) => {
  try {
    const { errandId, riderId } = req.body;

    const errand = await Errand.findById(errandId);
    if (!errand) {
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

    if (errand.riderId) {
      return res.json({
        success: false,
        message: "Order already assigned to a rider",
      });
    }

    errand.status = "Order Assigned";
    errand.riderId = riderId;
    await errand.save();

    rider.orders.push(errandId);
    await rider.save();
    res.json({ success: true, message: "Rider added to order successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmDelivery = async (req, res) => {
  try {
    const { errandId, code, riderId } = req.body;

    const errand = await Errand.findById(errandId);
    if (!errand) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (errand.riderId.toString() !== riderId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized rider" });
    }

    if (errand.deliveryCode !== code) {
      return res.json({ success: false, message: "Invalid delivery code" });
    }

    errand.status = "Order Delivered";

    await errand.save();
    res.json({ success: true, message: "Delivery confirmed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
