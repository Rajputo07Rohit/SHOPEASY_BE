import express from "express";
import {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  updateProductImage,
} from "../controller/product.js";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFiles from "../middlewares/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all", getAllProduct);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", isAuth, updateProduct);
router.post("/product/:id", isAuth, uploadFiles, updateProductImage);

export default router;
