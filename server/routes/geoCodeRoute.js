import express from "express";
import { searchAddresses } from "../controllers/geoCodeController.js";


const geoCodeRouter = express.Router();

geoCodeRouter.get("/geocode-suggest", (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter "q" is required.' });
  }

  const suggestions = searchAddresses(query);
  res.json({ success: true, suggestions });
});

export default geoCodeRouter;
