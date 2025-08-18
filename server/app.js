import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import connectCloudinary from "./configs/cloudinary.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectGeo from "./routes/geoCodeRoute.js";
import mailRouter from "./routes/mailRoute.js";
import smsRouter from "./routes/smsRoute.js";
import walletRouter from "./routes/walletRoute.js";
import riderRouter from "./routes/riderRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { paystackWebhooks } from "./controllers/paymentController.js";
import chatRouter from "./routes/chatRoute.js";
import dispatchRouter from "./routes/dispatchRoute.js";
import adminRouter from "./routes/adminRoute.js";
import axios from "axios";

await connectDB();
await connectCloudinary();

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.post(
  "/paystack-webhook",
  express.raw({ type: "application/json" }),
  paystackWebhooks
);

app.use(helmet());
app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

app.get("/", (req, res) => res.send("API is Working"));
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/rider", riderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", (await import("./routes/uploadRoute.js")).default);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/dispatch", dispatchRouter);
app.use("/api/geocoding", connectGeo);
app.use("/api/mail", mailRouter);
app.use("/api/sms", smsRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/chat", chatRouter);

const VERIFY_TOKEN = "my_verify_token";
const WHATSAPP_TOKEN =
  "EAAJwaWTCn8gBPFZAekZAErPOoAyxHuCkIF1xGJwyXyC3J7pMugZCKIhAOt3HM0NpZCzTlrcZB4aj8xNw56WCupAwJdhzduaJQonTNyjqZAsYnF8v4rNuSB0XIK8Fkv1MZAdjgL4RKCizAZCF9ZCVTFDoO5NEdBqGBsU4xtmxaW02kmbHiBmZAM1BIIYtd7yPcL1syZB4eoPK8lgcTCzHA65RRK0EubSRxdYi2ct2fcaZBsq2KAZDZD";
const PHONE_NUMBER_ID = "775498732309468";

// ✅ Webhook verification (GET)
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Handle incoming messages (POST)
app.post("/webhook", async (req, res) => {
  let body = req.body;

  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      let message = body.entry[0].changes[0].value.messages[0];
      let from = message.from; // WhatsApp user number
      let msg_body = message.text?.body;

      console.log("Incoming message:", msg_body);

      // Example response → product menu
      await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "interactive",
          interactive: {
            type: "list",
            body: {
              text: "Welcome to QuickXMarket! Choose a category:",
            },
            action: {
              button: "Categories",
              sections: [
                {
                  title: "Shop",
                  rows: [
                    { id: "electronics", title: "Electronics" },
                    { id: "fashion", title: "Fashion" },
                    { id: "groceries", title: "Groceries" },
                  ],
                },
              ],
            },
          },
        },
        { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
      );
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default app;
