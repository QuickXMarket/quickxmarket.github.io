import User from "../models/User.js";
import { sendPushNotification } from "../utils/fcmService.js";

// Update User CartData : /api/cart/update

export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "Cart Updated" });
    // await sendPushNotification(
    //   "erh6-bvUTw-C2Mc8kt1nK6:APA91bGcpJSU_89zcmNPanvv9t3JvRFic4mFzawXxUo3fMOAAZ5_VMk9_NbEWz5vcXErHIQgPr1A0xP_bQ_Kn-ojXi5qebXPQZg-4yIUchwu_1ebaeKsask",
    //   "New Order Received",
    //   "You have a new order. Check your seller dashboard.",
    //   {
    //     route: `/seller/orders/`,
    //   }
    // );
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
