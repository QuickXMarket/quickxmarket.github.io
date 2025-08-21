import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getAllOrders,
  getAllUsers,
  getChatList,
  getDashboardStats,
  getVendorRequests,
  isAuth,
  loginAdmin,
  logout,
  registerAdmin,
  vendorRequestResponse,
  getRiderRequests,
  riderRequestResponse,
} from "../controllers/admin/index.js";

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/is-auth", authUser, isAuth);
adminRouter.get("/logout", authUser, logout);
adminRouter.get("/chats", authUser, getChatList);
adminRouter.get("/users", authUser, getAllUsers);
adminRouter.get("/orders", authUser, getAllOrders);
adminRouter.get("/vendor-requests", authUser, getVendorRequests);
adminRouter.post("/vendorRequestResponse", authUser, vendorRequestResponse);
adminRouter.get("/rider-requests", authUser, getRiderRequests);
adminRouter.post("/riderRequestResponse", authUser, riderRequestResponse);
// adminRouter.get("/dashboard", authUser, getDashboardStats);

export default adminRouter;
