import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    latitude: { type: Number },
    longitude: { type: Number },
})

const Address = mongoose.models.address || mongoose.model('address', addressSchema)

export default Address