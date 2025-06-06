import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true },
    cartItems: {type: Object, default: {} },
    role: { type: String, enum: ['customer', 'vendor'], default: 'customer' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }]
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User