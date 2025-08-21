import Wallet from "../models/Wallet.js";
import bcrypt from "bcryptjs";

// Create wallet for a user (vendor or rider)
export const createWallet = async (req, res) => {
  try {
    const { userId, walletType } = req.body;

    const result = await createWalletLogic(userId, walletType);

    return res.json(result);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createWalletLogic = async (userId, walletType) => {
  try {
    if (!userId || !walletType) {
      return {
        success: false,
        message: "User ID and wallet type are required",
      };
    }

    const existing = await Wallet.findOne({ userId, walletType });
    if (existing) {
      return { success: false, message: "Wallet already exists" };
    }

    const wallet = await Wallet.create({
      userId,
      walletType,
      balance: 0,
      transactions: [],
    });

    return {
      success: true,
      wallet: {
        balance: wallet.balance,
        transactions: wallet.transactions,
      },
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get rider wallet
export const getRiderWallet = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const wallet = await Wallet.findOne({ userId, walletType: "rider" });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Rider wallet not found" });
    }

    return res.json({
      success: true,
      wallet: {
        balance: wallet.balance,
        transactions: wallet.transactions,
        pinSet: !!wallet.pin,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get vendor wallet
export const getVendorWallet = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const wallet = await Wallet.findOne({ userId, walletType: "vendor" });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor wallet not found" });
    }

    return res.json({
      success: true,
      wallet: {
        balance: wallet.balance,
        transactions: wallet.transactions,
        pinSet: !!wallet.pin,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Request withdrawal
export const withdrawalRequest = async (req, res) => {
  try {
    const { userId, amount, description, walletType } = req.body;

    if (!userId || !amount || !walletType) {
      return res.json({
        success: false,
        message: "User ID, amount, and wallet type are required",
      });
    }

    const wallet = await Wallet.findOne({ userId, walletType });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: `${walletType} wallet not found` });
    }

    const hasPending = wallet.transactions.some(
      (tx) => tx.type === "withdrawal" && tx.status === "pending"
    );
    if (hasPending) {
      return res.json({
        success: false,
        message: "You already have a pending withdrawal request",
      });
    }

    if (wallet.balance < amount) {
      return res.json({
        success: false,
        message: "Insufficient balance",
      });
    }

    wallet.transactions.push({
      type: "withdrawal",
      amount,
      status: "pending",
      description: description || "Withdrawal request",
    });

    await wallet.save();

    return res.json({
      success: true,
      message: "Withdrawal request submitted successfully",
      wallet: {
        balance: wallet.balance,
        transactions: wallet.transactions,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const creditWallet = async (req, res) => {
  try {
    const { userId, amount, walletType, description } = req.body;

    if (!userId || !amount || !walletType) {
      return res.json({
        success: false,
        message: "User ID, amount, and wallet type are required",
      });
    }

    if (amount <= 0) {
      return res.json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const wallet = await Wallet.findOne({ userId, walletType });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: `${walletType} wallet not found`,
      });
    }

    // Add to balance
    wallet.balance += amount;

    // Log transaction
    wallet.transactions.push({
      type: "credit",
      amount,
      status: "approved",
      description: description || "Wallet credited",
    });

    await wallet.save();

    return res.json({
      success: true,
      message: "Wallet credited successfully",
      wallet: {
        balance: wallet.balance,
        transactions: wallet.transactions,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create PIN
export const createWalletPin = async (req, res) => {
  try {
    const { userId, walletType, newPin, confirmPin } = req.body;

    if (!userId || !walletType || !newPin || !confirmPin) {
      return res.json({ success: false, message: "All fields are required" });
    }
    if (!/^[0-9]{4}$/.test(newPin) || !/^[0-9]{4}$/.test(confirmPin)) {
      return res.json({
        success: false,
        message: "PIN must be exactly 4 digits (0-9).",
      });
    }

    if (newPin !== confirmPin) {
      return res.json({ success: false, message: "PINs do not match" });
    }

    const wallet = await Wallet.findOne({ userId, walletType });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: `${walletType} wallet not found` });
    }

    if (wallet.pin) {
      return res.json({
        success: false,
        message: "PIN already set. Please edit instead.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    wallet.pin = await bcrypt.hash(newPin, salt);
    await wallet.save();

    return res.json({ success: true, message: "PIN created successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Edit PIN
export const editWalletPin = async (req, res) => {
  try {
    const { userId, walletType, newPin, currentPin } = req.body;

    if (!userId || !walletType || !newPin || !currentPin) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!/^[0-9]{4}$/.test(newPin) || !/^[0-9]{4}$/.test(currentPin)) {
      return res.json({
        success: false,
        message: "PIN must be exactly 4 digits (0-9).",
      });
    }

    const wallet = await Wallet.findOne({ userId, walletType });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: `${walletType} wallet not found` });
    }

    if (!wallet.pin) {
      return res.json({ success: false, message: "No PIN set yet" });
    }

    const isMatch = await bcrypt.compare(currentPin, wallet.pin);
    if (!isMatch) {
      return res.json({ success: false, message: "Current PIN is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    wallet.pin = await bcrypt.hash(newPin, salt);
    await wallet.save();

    return res.json({ success: true, message: "PIN updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm PIN
export const confirmWalletPin = async (req, res) => {
  try {
    const { userId, walletType, pin } = req.body;

    if (!userId || !walletType || !pin) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!/^[0-9]{4}$/.test(pin)) {
      return res.json({
        success: false,
        message: "PIN must be exactly 4 digits (0-9).",
      });
    }

    const wallet = await Wallet.findOne({ userId, walletType });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: `${walletType} wallet not found` });
    }

    if (!wallet.pin) {
      return res.json({ success: false, message: "No PIN set yet" });
    }

    const isMatch = await bcrypt.compare(pin, wallet.pin);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect PIN" });
    }

    return res.json({ success: true, message: "PIN confirmed successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
