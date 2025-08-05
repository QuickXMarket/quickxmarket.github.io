import cron from "node-cron";
import Vendor from "../models/Vendor.js";

const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

const toggleVendorOpenStatus = async () => {
  const currentTime = getCurrentTime();

  try {
    await Vendor.updateMany({ openingTime: currentTime }, { isOpen: true });

    await Vendor.updateMany({ closingTime: currentTime }, { isOpen: false });

    console.log(`[CRON] Vendor open status updated at ${currentTime}`);
  } catch (err) {
    console.error("Error updating vendor status:", err);
  }
};

export const startVendorToggleCron = () => {
  cron.schedule("* * * * *", toggleVendorOpenStatus);
};
