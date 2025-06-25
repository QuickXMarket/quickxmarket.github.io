import express from "express";
const mailRouter = express.Router();
import multer from "multer";
import { sendContactEmail } from "../controllers/mailController.js";

// Use multer memory storage for attachment upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

mailRouter.post("/contact", upload.single("attachment"), sendContactEmail);

export default mailRouter;
