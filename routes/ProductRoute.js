import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts).post(protect, upload.array("images", 5), createProduct);

router.route("/:id").get(getProductById);

export default router;