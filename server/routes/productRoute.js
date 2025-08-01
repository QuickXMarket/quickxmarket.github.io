import express from "express";
import { upload } from "../configs/multer.js";
import authUser from "../middlewares/authUser.js";
import {
  addProduct,
  changeStock,
  deleteProduct,
  editProduct,
  productById,
  productList,
  productListByVendor,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array(["images"]), authUser, addProduct);
productRouter.post("/edit", upload.array(["images"]), authUser, editProduct);
productRouter.get("/list", productList);
productRouter.get("/list/vendor", authUser, productListByVendor);
productRouter.post("/delete", authUser, deleteProduct);
productRouter.get("/id", productById);
productRouter.post("/stock", authUser, changeStock);

export default productRouter;
