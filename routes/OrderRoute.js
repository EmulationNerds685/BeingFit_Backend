import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();
router.use(protect);
router.route("/").get(getAllOrders);
router.route("/my-orders").get(getUserOrders);
router.route("/:id/status").put(updateOrderStatus);

export default router;