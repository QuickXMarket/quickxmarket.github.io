import axios from "axios";
import { sendOrderNotification } from "./mailController.js";
import { sendPushNotification } from "../utils/fcmService.js";
import Rider from "../models/Rider.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

export const placeOrderPaystack = async (req, res) => {
  try {
    const { userId, items, address, amount, isNativeApp } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }
    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();

    const orderData = {
      userId,
      deliveryCode,
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
            route: `/rider/`,
          }
        );
      }
    }
  }

  res.json({ received: true });
};
