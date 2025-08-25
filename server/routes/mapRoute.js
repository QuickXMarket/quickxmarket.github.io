import express from "express";
import {
  autocomplete,
  calculateDistance,
  geocode,
} from "../controllers/mapController.js";

const mapRouter = express.Router();

mapRouter.get("/autoComplete", autocomplete);
mapRouter.get("/geoCode", geocode);
mapRouter.get("/calculateDistance", calculateDistance);

export default mapRouter;
