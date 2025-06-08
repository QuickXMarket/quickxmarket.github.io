import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Upload Profile Photo : /api/upload/profile-photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });

    // Delete the file from local storage after upload
    fs.unlinkSync(req.file.path);

    return res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
