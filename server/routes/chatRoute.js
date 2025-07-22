import express from "express";
import { upload } from "../configs/multer.js";
import authUser from "../middlewares/authUser.js";
import {
  getChatHistory,
  sendNewMessage,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/send", upload.single("attachment"), authUser, sendNewMessage);
chatRouter.get("/get-chat", authUser, getChatHistory);

export default chatRouter;
