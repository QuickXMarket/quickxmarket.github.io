import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Address from "../models/Address.js";
import axios from "axios";
import { sendOrderNotification } from "./mailController.js";
import { sendPushNotification } from "../utils/fcmService.js";
import Rider from "../models/Rider.js";

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
    const { userId, items, address, amount, isNativeApp } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

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

    const callback_url = isNativeApp
      ? "quickxmarket://my-orders"
      : `${origin}/loader?next=my-orders`;

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
        callback_url,
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
    const reference = event.data.reference;

    const existingOrder = await Order.findOne({ paystackReference: reference });
    if (existingOrder) {
      return res.status(200).json({ received: true });
    }

    // If not, proceed to create
    const order = await Order.create({
      ...orderData,
      isPaid: true,
      paystackReference: reference,
    });

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

        await Vendor.findByIdAndUpdate(
          vendorId,
          { $push: { orders: order._id } },
          { new: true }
        );
      }

      const riders = await Rider.find().populate("userId");

      const riderEmails = [];
      const riderFcmTokens = [];

      for (const rider of riders) {
        if (rider?.userId) {
          const { email, fcmToken } = rider.userId;

          if (email) riderEmails.push(email);
          if (fcmToken) riderFcmTokens.push(fcmToken);
        }
      }

      const customerAddress = populatedOrder.address || {};

      await sendOrderNotification({
        orderId: populatedOrder._id.toString(),
        products: productDetails,
        customerEmail: customerAddress.email,
        customerAddress,
        vendorEmails,
        riderEmails,
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

      for (const token of riderFcmTokens) {
        await sendPushNotification(
          token,
          "New Delivery Request",
          "A new order has been placed. Check your rider dashboard.",
          {
            route: `/rider`,
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

// Get Vendor Orders : /api/order/vendor
export const getVendorOrders = async (req, res) => {
  try {
    const { vendorId } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.json({ success: false, message: "Vendor not found" });
    }

    await vendor.populate({
      path: "orders",
      match: { isPaid: true },
      populate: {
        path: "items.product address",
      },
      options: {
        sort: { createdAt: -1 },
      },
    });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRiderOrders = async (req, res) => {
  try {
    const riderId = req.body.riderId;

    const orders = await Order.find({ riderId, isPaid: true })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    const modifiedOrders = [];

    for (const order of orders) {
      const vendorMap = new Map();

      // Group products by vendorId
      for (const item of order.items) {
        const product = item.product;
        const vendorId = product.vendorId.toString();

        if (!vendorMap.has(vendorId)) {
          vendorMap.set(vendorId, {
            vendorId,
            products: [],
          });
        }

        vendorMap.get(vendorId).products.push({
          name: product.name,
          quantity: item.quantity,
          totalPrice: product.offerPrice * item.quantity,
          status: item.status,
        });
      }

      // Fetch vendor details for each group
      const vendorGroups = [];

      for (const [vendorId, group] of vendorMap.entries()) {
        const vendor = await Vendor.findById(vendorId).select(
          "businessName number address"
        );

        if (vendor) {
          vendorGroups.push({
            vendor: {
              _id: vendor._id,
              name: vendor.businessName,
              phone: vendor.number,
              address: vendor.address,
            },
            products: group.products,
          });
        }
      }

      modifiedOrders.push({
        _id: order._id,
        createdAt: order.createdAt,
        address: order.address,
        riderId: order.riderId,
        vendors: vendorGroups,
      });
    }
    

    res.json({ success: true, orders: modifiedOrders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
