import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { paystackWebhooks } from "./controllers/orderController.js";
import geoCodeRouter from "./routes/geoCodeRoute.js";
import { loadGeoJsonData } from "./controllers/geoCodeController.js";
import mailRouter from "./routes/mailRoute.js";
import smsRouter from "./routes/smsRoute.js";
import riderRouter from "./routes/riderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.post(
  "/paystack-webhook",
  express.raw({ type: "application/json" }),
  paystackWebhooks
);

// Middleware configuration
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => res.send("API is Working"));
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/rider", riderRouter);
app.use("/api/upload", (await import("./routes/uploadRoute.js")).default);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/geocoding", geoCodeRouter);
app.use("/api/mail", mailRouter);
app.use("/api/sms", smsRouter);

// loadGeoJsonData();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
