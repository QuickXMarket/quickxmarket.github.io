import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Address from "../models/Address.js";
import axios from "axios";
import { sendOrderNotification } from "./mailController.js";
import { sendPushNotification } from "../utils/fcmService.js";

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

// New API handler for delivery fee calculation
export const getDeliveryFee = async (req, res) => {
  try {
    const { latitude, longitude, vendorIds } = req.body;
    if (!latitude || !longitude || !Array.isArray(vendorIds)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
    const totalDeliveryFee = await calculateTotalDeliveryFee(
      latitude,
      longitude,
      vendorIds
    );
    return res.json({ success: true, totalDeliveryFee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Place Order Paystack : /api/order/paystack
export const placeOrderPaystack = async (req, res) => {
  try {
    const { userId, items, address, amount } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Prepare order data to send in metadata
    const orderData = {
      userId,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        status: "Order Placed",
      })),
      amount,
      address,
      paymentType: "Online",
    };

    // Paystack Initialize
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Create Paystack transaction initialization request
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.body.email,
        amount: amount * 100, // amount in kobo
        metadata: {
          orderData,
          userId,
        },
        callback_url: `${origin}/loader?next=my-orders`,
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (paystackResponse.data.status) {
      return res.json({
        success: true,
        url: paystackResponse.data.data.authorization_url,
      });
    } else {
      return res.json({
        success: false,
        message: "Failed to initialize Paystack transaction",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Paystack Webhooks to Verify Payments Action : /paystack-webhook
export const paystackWebhooks = async (req, res) => {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  const hash = req.headers["x-paystack-signature"];
  const crypto = await import("crypto");

  const body = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha512", paystackSecretKey);
  hmac.update(body);
  const digest = hmac.digest("hex");

  if (digest !== hash) {
    return res.status(401).send("Unauthorized");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const { orderData, userId } = event.data.metadata;

    // Create order in DB after payment confirmation
    const order = await Order.create({ ...orderData, isPaid: true });

    // Clear user cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });
    const websiteDomain = process.env.WEBSITE_URL;

    // Fetch order details for email
    const populatedOrder = await Order.populate(order, {
      path: "items.product address",
    });

    if (populatedOrder) {
      const productDetails = populatedOrder.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        totalPrice: item.product.offerPrice * item.quantity,
        imageUrl: item.product.imageUrl || "",
        productLink: `${websiteDomain}/products/${item.product.category}/${item.product._id}`,
        vendorId: item.product.vendorId,
      }));

      const vendorIds = [
        ...new Set(
          productDetails.map((product) => product.vendorId.toString())
        ),
      ];

      const vendorEmails = [];
      const vendorFcmTokens = [];

      for (const vendorId of vendorIds) {
        const vendor = await Vendor.findById(vendorId).populate("userId");
        if (vendor?.userId) {
          const { email, fcmToken } = vendor.userId;

          if (email) vendorEmails.push(email);
          if (fcmToken) vendorFcmTokens.push(fcmToken);
        }
      }

      const customerAddress = populatedOrder.address || {};

      await sendOrderNotification({
        orderId: populatedOrder._id.toString(),
        products: productDetails,
        customerEmail: customerAddress.email,
        vendorEmails,
      });

      for (const token of vendorFcmTokens) {
        await sendPushNotification(
          token,
          "New Order Received",
          "You have a new order. Check your seller dashboard.",
          {
            route: `/seller/orders/`,
          }
        );
      }
      
    }
  }

  res.json({ received: true });
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const vendorId = req.body.userId;

    // Find products of this vendor
    const vendorProducts = await Product.find({ vendorId }).select("_id");
    const vendorProductIds = vendorProducts.map((p) => p._id);

    // Find orders that contain items with products belonging to this vendor
    const orders = await Order.find({
      isPaid: true,
      "items.product": { $in: vendorProductIds },
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
