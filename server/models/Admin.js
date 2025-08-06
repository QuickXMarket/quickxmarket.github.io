import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
      match: /^[^\s@]+@quickxmarket\.com\.ng$/, // Enforce admin domain
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
      select: false,
    },

    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^(?:\+?234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|911|912|913|915|916)\d{7}$/,
        "Invalid Nigerian phone number",
      ],
    },

    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },

    permissions: {
      type: [String],
      default: [],
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Admin = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default Admin;
