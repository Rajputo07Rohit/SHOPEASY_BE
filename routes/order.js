import express from "express";
import {
  getAllOrders,
  getAlLOrdersAdmin,
  getMyOrder,
  getStats,
  newOrderCod,
  updateStatus,
} from "../controller/order.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/order/new/cod", isAuth, newOrderCod);
router.get("/order/all", isAuth, getAllOrders);
router.get("/order/admin/all", isAuth, getAlLOrdersAdmin);
router.get("/order/:id", isAuth, getMyOrder);
router.post("/order/:id", isAuth, updateStatus);
router.get("/stats", isAuth, getStats);

export default router;
