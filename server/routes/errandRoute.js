import express from "express";
import authUser from "../middlewares/authUser.js";
import { getErrandDeliveryFee, getUserErrand } from "../controllers/errandController.js";

const errandRouter = express.Router();

// errandRouter.post('/cod', authUser, placeOrderCOD);
errandRouter.get("/user", authUser, getUserErrand);
// errandRouter.get("/rider/:riderId", authUser, getRiderDispatch);
errandRouter.post("/delivery-fee", authUser, getErrandDeliveryFee);
// errandRouter.patch("/update-status", authUser, updateDispatchStatus);
// errandRouter.post("/accept", authUser, assignRiderToDispatch);
// errandRouter.post("/confirm-delivery", authUser, confirmDelivery);

export default errandRouter;
