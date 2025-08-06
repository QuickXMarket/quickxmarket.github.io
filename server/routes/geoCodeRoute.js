import express from "express";
import {
  fetchAddresses,
  searchAddresses,
} from "../controllers/geoCodeController.js";

const geoCodeRouter = express.Router();

geoCodeRouter.get("/geocode-suggest", (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json({
      success: false,
      message: 'Query parameter "q" is required.',
    });
  }

  const suggestions = searchAddresses(query);
  res.json({ success: true, suggestions });
});

geoCodeRouter.get("/fetchAddresses", fetchAddresses);

export default geoCodeRouter;
