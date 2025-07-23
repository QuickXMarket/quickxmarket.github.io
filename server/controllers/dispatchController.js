import Dispatch from "../models/Dispatch.js";
import { calculateDeliveryFee } from "../utils/deliveryService.js";

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
