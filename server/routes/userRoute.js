import express from "express";
import {
  isAuth,
  login,
  logout,
  register,
  updateUserFcmToken,
  updateUserRole,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logout);
userRouter.patch("/update-role", authUser, updateUserRole);
userRouter.patch("/update-fcm-token", authUser, updateUserFcmToken);
userRouter.post("/wishListUpdate", authUser, );

export default userRouter;
