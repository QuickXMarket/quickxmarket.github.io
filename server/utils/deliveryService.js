import Vendor from "../models/Vendor.js";

// Existing haversineDistance function unchanged
function haversineDistance(lat1, lon1, lat2, lon2) {
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
  console.log(d);
  return d; // Distance in km
}

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
      const distance = haversineDistance(
        customerLat,
        customerLon,
        vendor.latitude,
        vendor.longitude
      );
      // 100 Naira per km, minimum 100 Naira
      const deliveryFee = Math.max(100, Math.round(distance) * 100);
      totalDeliveryFee += deliveryFee;
    }
  }
  return totalDeliveryFee;
};
