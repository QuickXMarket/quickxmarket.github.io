import { placeDispatchPaystackService } from "../../controllers/paymentController.js";
import {
  calculateDeliveryFee,
  calculateServiceFee,
} from "../../utils/deliveryService.js";
export const getDispatchTotal = async (data) => {
  const deliveryAddressCoords = data["deliveryAddress_coords"];
  const pickupAddressCoords = data["pickupAddress_coords"];
  const isExpress = data.deliveryType === "Express";
  const deliveryFee =
    (await calculateDeliveryFee(
      pickupAddressCoords.lat,
      pickupAddressCoords.lon,
      deliveryAddressCoords.lat,
      deliveryAddressCoords.lon
    )) * (isExpress ? 1.5 : 1);

  const serviceFee = await calculateServiceFee(deliveryFee);
  const totalFee = deliveryFee + serviceFee;

  return `Here's the breakdown of your fees:\n
- Delivery Fee: ₦${deliveryFee}\n
- Service Fee: ₦${serviceFee}\n
- Total: ₦${totalFee}\n
Would you like to proceed with this order? (yes/no)`;
};

export const completeDispatchRequest = async (data, intent, userId) => {
  if (intent === "confirm.yes") {
    const paymentData = {
      userId,
      pickupAddress: {
        name: data.senderName,
        phone: userId,
        address: data.pickupAddress,
        latitude: data.pickupAddress_coords.lat,
        longitude: data.pickupAddress_coords.lon,
      },
      dropoff: {
        name: data.recipientName,
        phone: data.recipientPhone,
        address: data.deliveryAddress,
        latitude: data.deliveryAddress_coords.lat,
        longitude: data.deliveryAddress_coords.lon,
      },
      deliveryNote: data.deliveryDetails,
      isExpress: data.deliveryType === "Express",
    };
    const websiteDomain = process.env.WEBSITE_URL;

    const response = await placeDispatchPaystackService(
      paymentData,
      websiteDomain
    );
    return { selected: response.url };
  } else {
    return { retry: true, message: "" };
  }
};
