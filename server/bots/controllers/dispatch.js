import { placeDispatchPaystackService } from "../../controllers/paymentController.js";
import Dispatch from "../../models/Dispatch.js";
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

export const completeDispatchRequest = async (data, response, userId) => {
  if (response.intent === "confirm.yes") {
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

export const getAllDispatches = async (userId) => {
  const orders = await Dispatch.find({ userId }).sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return { selected: "You have no dispatch orders at the moment." };
  }

  const reply = orders
    .map(
      (order, index) =>
        `${index + 1}. Order ID: ${order._id}\n   Total: ₦${
          order.totalFee
        }\n   Status: ${
          order.status
        }\n   Created At: ${order.createdAt.toLocaleString()}`
    )
    .join("\n\n");

  return {
    selected: `Here are your dispatch orders:\n\n${reply}\n\nSend the ID of a dispatch to see its full details.`,
  };
};

export const getDispatchDetails = async (userId, dispatchId) => {
  const order = await Dispatch.findById(dispatchId).populate("riderId");
  if (!order) {
    return { selected: "No dispatch found with that ID." };
  }

  if (order.userId.toString() !== userId.toString()) {
    return { selected: "You do not have access to this dispatch." };
  }

  const riderInfo = order.riderId
    ? `Rider: ${order.riderId.name || "N/A"}\nRider Phone: ${
        order.riderId.phone || "N/A"
      }\n`
    : "Rider: Not assigned yet\n";

  const reply = `
📦 Dispatch Details
-------------------
Dispatch ID: ${order._id}
Status: ${order.status || "Pending"}
Total Fee: ₦${order.totalFee || "N/A"}
Delivery Type: ${order.isExpress ? "Express" : "Standard"}

Created At: ${order.createdAt.toLocaleString()}

Pickup Details:
  Name: ${order.pickupAddressDetails.name}
  Address: ${order.pickupAddressDetails.address}

Drop-off Details:
  Name: ${order.dropoff.name}
  Phone: ${order.dropoff.phone}
  Address: ${order.dropoff.address}

${riderInfo}
Delivery Note: ${order.deliveryNote || "None"}
`;

  return { selected: reply.trim() };
};
