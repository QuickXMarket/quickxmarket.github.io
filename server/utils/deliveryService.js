import { getDistance } from "../controllers/mapController.js";
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
  const distanceData = await getDistance(
    { lat: lat1, lng: lon1 },
    { lat: lat2, lng: lon2 }
  );
  
  const element = distanceData.rows[0]?.elements[0];
  if (!element || element.status !== "OK") {
    throw new Error("Unable to calculate distance");
  }

  const distanceKm = element.distance.value / 1000;

  let deliveryFee = 500;

  if (distanceKm >= 0.6 && distanceKm < 1) deliveryFee = 600;
  else if (distanceKm >= 1 && distanceKm < 2) deliveryFee = 750;
  else if (distanceKm >= 2 && distanceKm < 3) deliveryFee = 750;
  else if (distanceKm >= 3 && distanceKm < 4) deliveryFee = 900;
  else if (distanceKm >= 4 && distanceKm < 5) deliveryFee = 1000;
  else if (distanceKm >= 5 && distanceKm < 6) deliveryFee = 1200;
  else if (distanceKm >= 6 && distanceKm < 7) deliveryFee = 1500;
  else if (distanceKm >= 7) deliveryFee = 1800;

  return deliveryFee;
};

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
