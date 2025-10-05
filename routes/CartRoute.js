import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();
router.use(protect);

router.route("/")
    .get(getUserCart)
    .post(addToCart)
    .put(updateCartItem)
    .delete(removeFromCart);

router.route("/clear").delete(clearCart);
export default router;