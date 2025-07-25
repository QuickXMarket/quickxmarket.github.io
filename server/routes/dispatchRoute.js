import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  assignRiderToDispatch,
  confirmDelivery,
  getDeliveryFee,
  getRiderDispatch,
  getUserDispatch,
  updateDispatchStatus,
} from "../controllers/dispatchController.js";

const dispatchRouter = express.Router();

// dispatchRouter.post('/cod', authUser, placeOrderCOD);
dispatchRouter.get("/user", authUser, getUserDispatch);
dispatchRouter.get("/rider/:riderId", authUser, getRiderDispatch);
dispatchRouter.post("/delivery-fee", authUser, getDeliveryFee);
dispatchRouter.patch("/update-status", authUser, updateDispatchStatus);
dispatchRouter.post("/accept", authUser, assignRiderToDispatch);
dispatchRouter.post("/confirm-delivery", authUser, confirmDelivery);

export default dispatchRouter;
