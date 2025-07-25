import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import connectCloudinary from "./configs/cloudinary.js";

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

await connectDB();
await connectCloudinary();

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.post(
  "/paystack-webhook",
  express.raw({ type: "application/json" }),
  paystackWebhooks
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => res.send("API is Working"));
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/rider", riderRouter);
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

export default app;
