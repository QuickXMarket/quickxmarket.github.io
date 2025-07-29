import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isEmailDomainValid } from "../utils/emailValidation.js";
import { OAuth2Client } from "google-auth-library";

// Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate email domain MX record
    const isValidDomain = await isEmailDomainValid(email);
    if (!isValidDomain) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email domain." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript to access cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    return res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(googleId, 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    const JWTtoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", JWTtoken, {
      httpOnly: true, // Prevent JavaScript to access cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    return res.json({
      success: true,
      token: JWTtoken,
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
    });
  } catch (err) {
    console.error("Token verification failed", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Login User : /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const isValidDomain = await isEmailDomainValid(email);
    if (!isValidDomain) {
      return res.status(400).json({
        success: false,
        message: "Invalid email domain.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        isSeller: user.isSeller,
        isRider: user.isRider,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout User : /api/user/logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update User Role : /api/user/update-role
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or role" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (role === "vendor" && !user.isSeller) {
      user.isSeller = true;
    } else if (role === "rider" && !user.isRider) {
      user.isRider = true;
    }

    await user.save();
    return res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        email: user.email,
        name: user.name,
        isSeller: user.isSeller,
        isRider: user.isRider,
        _id: user._id,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWishList = async (req, res) => {
  try {
    const { userId, wishList } = req.body;
    await User.findByIdAndUpdate(userId, { wishList });
    res.json({ success: true, message: "Added to Wish List" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateUserFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or fcmToken" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.fcmToken = fcmToken;
    await user.save();

    return res.json({
      success: true,
      message: "FCM token updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleOnlineStatus = async (userId, status) => {
  try {
    await User.findByIdAndUpdate(userId, {
      isOnline: status,
      ...(status === false && { lastSeen: new Date() }),
    });

    console.log(`User ${userId} is now ${status ? "online" : "offline"}`);
  } catch (error) {
    console.error("Failed to toggle online status:", error.message);
  }
};
