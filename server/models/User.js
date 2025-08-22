import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
      select: false,
    },

    cartItems: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (value) {
          return Object.keys(value || {}).length <= 100;
        },
        message: "Cart cannot have more than 100 items.",
      },
    },

    fcmToken: {
      type: String,
      default: null,
      maxlength: 1024,
      trim: true,
    },

    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    isSeller: {
      type: Boolean,
      default: false,
    },

    isRider: {
      type: Boolean,
      default: false,
    },

    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: { expireAfterSeconds: 60 * 60 * 24 * 30 }, 
    },
  },
  {
    minimize: false,
    timestamps: true,
    strict: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("deleted")) {
    if (this.deleted) {
      this.deletedAt = new Date();
    } else {
      this.deletedAt = null;
    }
  }
  next();
});

const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;
