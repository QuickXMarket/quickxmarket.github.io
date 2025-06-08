import express from "express";
import multer from "multer";
import { uploadProfilePhoto } from "../controllers/uploadController.js";

const uploadRouter = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

uploadRouter.post("/profile-photo", upload.single("file"), uploadProfilePhoto);

export default uploadRouter;
