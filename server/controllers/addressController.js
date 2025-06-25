import Address from "../models/Address.js";
import { isEmailDomainValid } from "../utils/emailValidation.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;

    if (!address.email) {
      return res.status(400).json({ success: false, message: "Email is required in address." });
    }

    // Validate email domain MX record
    const isValidDomain = await isEmailDomainValid(address.email);
    if (!isValidDomain) {
      return res.status(400).json({ success: false, message: "Invalid email domain." });
    }

    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Address : /api/address/get
export const getAddress = async(req, res)=>{
    try {
        const { userId } = req.body
        const addresses = await Address.find({userId})
        res.json({success: true, addresses})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
