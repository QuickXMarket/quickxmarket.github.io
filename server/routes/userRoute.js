import express from "express";
import {
  changePassword,
  editEmail,
  editProfileDetails,
  googleSignIn,
  isAuth,
  login,
  logout,
  register,
  updateUserFcmToken,
  updateUserRole,
  updateWishList,
  userAccountDelete,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import {
  resetPassword,
  sendPasswordResetEmail,
} from "../controllers/PasswordResetController.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/google-signin", googleSignIn);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.post("/deleteAccount", authUser, userAccountDelete);
userRouter.patch("/edit-profile", authUser, editProfileDetails);
userRouter.patch("/edit-email", authUser, editEmail);
userRouter.patch("/change-password", authUser, changePassword);
userRouter.get("/logout", authUser, logout);
userRouter.patch("/update-role", authUser, updateUserRole);
userRouter.patch("/update-fcm-token", authUser, updateUserFcmToken);
userRouter.post("/wishListUpdate", authUser, updateWishList);
userRouter.post("/sendPasswordResetEmail", sendPasswordResetEmail);
userRouter.post("/resetPassword", resetPassword);

export default userRouter;
