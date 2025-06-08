import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    profilePhoto: { type: String },
    businessName: { type: String, required: true },
    number: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'order' }]
}, { timestamps: true });

const Vendor = mongoose.models.vendor || mongoose.model('vendor', vendorSchema);

export default Vendor;
