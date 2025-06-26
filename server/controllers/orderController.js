import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Address from "../models/Address.js";
import axios from "axios";
import { sendOrderNotification } from "./mailController.js";

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
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);

      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Paystack Initialize
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Create Paystack transaction initialization request
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.body.email || "customer@example.com",
        amount: amount * 100, // amount in kobo
        metadata: {
          orderId: order._id.toString(),
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
    const { orderId, userId } = event.data.metadata;

    // Mark Payment as Paid
    await Order.findByIdAndUpdate(orderId, { isPaid: true });
    // Clear user cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    // Fetch order details for email
    const order = await Order.findById(orderId).populate(
      "items.product address"
    );
    const productDetails = order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      totalPrice: item.product.offerPrice * item.quantity,
      imageUrl: item.product.imageUrl || "",
      productLink: `https://quickxmarket.vercel.app/products/${item.product.category}/${item.product._id}`,
      vendorId: item.product.vendorId,
    }));

    if (order) {
      const vendorIds = [
        ...new Set(
          productDetails.map((product) => product.vendorId.toString())
        ),
      ];

      const vendorEmails = [];
      for (const vendorId of vendorIds) {
        const vendor = await Vendor.findById(vendorId).populate("userId");
        if (vendor && vendor.userId && vendor.userId.email) {
          vendorEmails.push(vendor.userId.email);
        }
      }

      const customerAddress = await Address.findById(order.address);

      await sendOrderNotification({
        orderId: order._id.toString(),
        products: productDetails,
        customerEmail: customerAddress.email,
        vendorEmails,
      });
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
      isPaid: true,
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
