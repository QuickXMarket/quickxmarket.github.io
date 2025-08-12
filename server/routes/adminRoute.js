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
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/is-auth", authUser, isAuth);
// adminRouter.patch("/edit-profile", authUser, editProfileDetails);
// adminRouter.patch("/edit-email", authUser, editEmail);
// adminRouter.patch("/change-password", authUser, changePassword);
adminRouter.get("/logout", authUser, logout);
adminRouter.get("/chats", authUser, getChatList);
adminRouter.get("/users", authUser, getAllUsers);
adminRouter.get("/orders", authUser, getAllOrders);
adminRouter.get("/vendor-requests", authUser, getVendorRequests);
// adminRouter.get("/dashboard", authUser, getDashboardStats);

export default adminRouter;
