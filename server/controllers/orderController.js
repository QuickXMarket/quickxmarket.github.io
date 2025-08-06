import Order from "../models/Order.js";
import Rider from "../models/Rider.js";
import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import { calculateTotalDeliveryFee } from "../utils/deliveryService.js";
import { sendOrderNotification } from "./mailController.js";
import { sendPushNotification } from "../utils/fcmService.js";

export const createNewOrder = async (res, userId, reference, orderData) => {
  try {
    const existingOrder = await Order.findOne({ paystackReference: reference });
    if (existingOrder) {
      return res.status(200).json({ received: true });
    }

    const order = await Order.create({
      ...orderData,
      isPaid: true,
      paystackReference: reference,
    });

    await User.findByIdAndUpdate(userId, { cartItems: {} });

    const websiteDomain = process.env.WEBSITE_URL;
    const populatedOrder = await Order.populate(order, {
      path: "items.product address",
    });

    const productDetails = populatedOrder.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      totalPrice: item.product.offerPrice * item.quantity,
      imageUrl: item.product.imageUrl || "",
      productLink: `${websiteDomain}/products/${item.product.category}/${item.product._id}`,
      vendorId: item.product.vendorId,
    }));

    const vendorIds = [
      ...new Set(productDetails.map((p) => p.vendorId.toString())),
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
      try {
        await sendPushNotification(
          token,
          "New Order Received",
          "You have a new order. Check your seller dashboard.",
          { route: `/seller/orders/` }
        );
      } catch (error) {
        console.error(
          "Error sending notification to token:",
          token,
          error.message
        );
      }
    }

    for (const token of riderFcmTokens) {
      try {
        await sendPushNotification(
          token,
          "New Delivery Request",
          "A new order has been placed. Check your rider dashboard.",
          { route: `/rider/` }
        );
      } catch (error) {
        console.error(
          "Error sending notification to token:",
          token,
          error.message
        );
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error(" Error creating new order:", err);
    return res.status(500).json({ received: false, message: err.message });
  }
};

export const getDeliveryFee = async (req, res) => {
  try {
    const { latitude, longitude, vendorIds } = req.body;
    if (!latitude || !longitude || !Array.isArray(vendorIds)) {
      return res.json({ success: false, message: "Invalid data" });
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
    const { vendorId } = req.params;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.json({ success: false, message: "Vendor not found" });
    }

    const populatedVendor = await vendor.populate({
      path: "orders",
      match: { isPaid: true },
      populate: {
        path: "items.product address",
      },
      options: {
        sort: { createdAt: -1 },
      },
    });

    const orders = populatedVendor.orders.map((order) => {
      const { deliveryCode, ...rest } = order.toObject();
      return rest;
    });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Rider Orders : /api/order/rider/:riderId
export const getRiderOrders = async (req, res) => {
  try {
    const { riderId } = req.params;

    const orders = await Order.find({
      isPaid: true,
      $or: [{ riderId: null }, { riderId }],
      "items.status": { $nin: ["Order Placed", "Order Delivered"] },
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    const modifiedOrders = [];

    for (const order of orders) {
      const vendorMap = new Map();

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

// Accept Order by Rider : /api/order/accept
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, vendorId } = req.body;

    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update item statuses conditionally
    order.items.forEach((item) => {
      if (
        !vendorId ||
        (item.product.vendorId && item.product.vendorId.toString() === vendorId)
      ) {
        item.status = status;
      }
    });

    await order.save();
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addRiderToOrder = async (req, res) => {
  try {
    const { orderId, riderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res
        .status(404)
        .json({ success: false, message: "Rider not found" });
    }
    if (order.riderId) {
      return res.json({
        success: false,
        message: "Order already assigned to a rider",
      });
    }
    order.items.forEach((item) => {
      item.status = "Order Assigned";
    });

    order.riderId = riderId;
    await order.save();

    rider.orders.push(orderId);
    await rider.save();
    res.json({ success: true, message: "Rider added to order successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmDelivery = async (req, res) => {
  try {
    const { orderId, code, riderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.riderId.toString() !== riderId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized rider" });
    }

    if (order.deliveryCode !== code) {
      return res.json({ success: false, message: "Invalid delivery code" });
    }

    order.items.forEach((item) => {
      item.status = "Order Delivered";
    });

    await order.save();
    res.json({ success: true, message: "Delivery confirmed successfully" });
  } catch (error) {
    console.log("fail");
    res.status(500).json({ success: false, message: error.message });
  }
};
