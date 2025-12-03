import express from "express";
import { createProduct, getAllProduct } from "../controller/product.js";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFiles from "../middlewares/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/products/all", getAllProduct);

export default router;
