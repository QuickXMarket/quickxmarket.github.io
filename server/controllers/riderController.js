import Rider from "../models/Rider.js";
import { createWalletLogic } from "./walletController.js";

export const createRider = async (req, res) => {
  try {
    const { userId, name, number, dob, vehicle } = req.body;

    if (!userId || !name || !number || !dob || !vehicle) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const existingRider = await Rider.findOne({ userId });
    if (existingRider) {
      return res.json({ success: false, message: "Rider already registered" });
    }

    const rider = await Rider.create({
      userId,
      name,
      number,
      dob,
      vehicleType: vehicle,
    });

    const walletResult = await createWalletLogic(userId, "rider");
    if (!walletResult.success) {
      console.warn("Wallet not created:", walletResult.message);
    }

    return res.json({ success: true, rider });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Get rider by userId
export const getRiderByUserId = async (req, res) => {
  try {
    const { userId } = req.body;
    const rider = await Rider.findOne({ userId });

    if (!rider) {
      return res.json({ success: false, message: "Rider not found" });
    }
    return res.json({ success: true, rider });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getRiderById = async (req, res) => {
  try {
    const { riderId } = req.params;
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.json({ success: false, message: "Rider not found" });
    }
    return res.json({ success: true, rider });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};
