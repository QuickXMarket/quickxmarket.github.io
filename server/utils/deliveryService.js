import Vendor from "../models/Vendor.js";

// Existing haversineDistance function unchanged
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // Distance in km
};

export const calculateDeliveryFee = async (lat1, lon1, lat2, lon2) => {
  const distance = haversineDistance(lat1, lon1, lat2, lon2);

  let deliveryFee = 100;

  if (distance >= 0.6 && distance < 1) deliveryFee = 600;
  else if (distance >= 1 && distance < 2) deliveryFee = 750;
  else if (distance >= 2 && distance < 3) deliveryFee = 750;
  else if (distance >= 3 && distance < 4) deliveryFee = 900;
  else if (distance >= 4 && distance < 5) deliveryFee = 1000;
  else if (distance >= 5 && distance < 6) deliveryFee = 1200;
  else if (distance >= 6 && distance < 7) deliveryFee = 1500;
  else if (distance >= 7) deliveryFee = 1800;
  return deliveryFee;
};

// New function to calculate total delivery fee for multiple vendors
export const calculateTotalDeliveryFee = async (
  customerLat,
  customerLon,
  vendorIds
) => {
  let totalDeliveryFee = 0;
  for (const vendorId of vendorIds) {
    const vendor = await Vendor.findById(vendorId);
    if (vendor && vendor.latitude && vendor.longitude) {
      const deliveryFee = await calculateDeliveryFee(
        customerLat,
        customerLon,
        vendor.latitude,
        vendor.longitude
      );
      totalDeliveryFee += deliveryFee;
    }
  }
  return totalDeliveryFee;
};

export const calculateServiceFee = async (totalPrice) => {
  let serviceFee = 0;
  if (totalPrice < 2500) {
    serviceFee = (1.5 * totalPrice) / 100;
  } else {
    serviceFee = (1.5 * totalPrice) / 100 + 100;
  }
  if (serviceFee > 2000) {
    serviceFee = 2000;
  }
  const roundedServiceFee = Math.ceil(serviceFee / 10) * 10;
  return roundedServiceFee;
};
