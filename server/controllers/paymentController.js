import axios from "axios";
import Address from "../models/Address.js";
import {
  calculateDeliveryFee,
  calculateServiceFee,
} from "../utils/deliveryService.js";
import { createNewOrder } from "./orderController.js";
import { createNewDispatch } from "./dispatchController.js";

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

export const placeDispatchPaystack = async (req, res) => {
  try {
    const {
      userId,
      pickupAddress,
      dropoff,
      deliveryNote,
      isExpress,
      email,
      isNativeApp,
    } = req.body;

    const { origin } = req.headers;

    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();
    const pickupAddressDetails = await Address.findById(pickupAddress);

    const deliveryFee =
      (await calculateDeliveryFee(
        pickupAddressDetails.latitude,
        pickupAddressDetails.longitude,
        dropoff.latitude,
        dropoff.longitude
      )) * (isExpress ? 1.5 : 1);
    const serviceFee = await calculateServiceFee(deliveryFee);
    const totalFee = deliveryFee + serviceFee;

    const dispatchData = {
      userId,
      pickupAddress,
      dropoff,
      deliveryNote,
      isExpress,
      deliveryFee,
      serviceFee,
      totalFee,
      paymentType: "online",
      deliveryCode,
    };

    const callback_url = isNativeApp
      ? "quickxmarket://dispatch"
      : `${origin}/loader?next=dispatch`;

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: totalFee * 100,
        metadata: {
          dispatchData,
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
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
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
  if (event.event !== "charge.success") {
    return res.status(200).json({ received: true });
  }
  const reference = event.data.reference;
  const metadata = event.data.metadata || {};
  const { userId } = metadata;

  if (metadata.orderData) {
    const orderData = metadata.orderData;
    await createNewOrder(res, userId, reference, orderData);
  }
  if (metadata.dispatchData) {
    const dispatchData = metadata.dispatchData;
    await createNewDispatch(res, userId, reference, dispatchData);
  }
};

export const verifyPaystackTransaction = async (req, res) => {
  const { reference } = req.params;

  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const { data } = response.data;

    if (data.status !== "success") {
      return res
        .status(400)
        .json({ received: false, message: "Payment not successful" });
    }

    const metadata = data.metadata || {};

    const { userId } = metadata;

    if (metadata.orderData) {
      const orderData = metadata.orderData;
      await createNewOrder(res, userId, reference, orderData);
    }
    if (metadata.dispatchData) {
      const dispatchData = metadata.dispatchData;
      await createNewDispatch(res, userId, reference, dispatchData);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ received: false, message: "Verification failed", error });
  }
};
