import express from "express";
import upload from "../config/multer.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const product = new Product({
      name,
      description,
      price:Number(price),
      category,
      stock:Number(stock),
      images: req.files.map(file => file.path), 
    });

    await product.save();
    res.status(201).json(product);
} catch (err) {
  console.error("Upload Error:", err);
  res.status(500).send(err.message); // 👈 ab Postman me plain text error dikh jaayega
}

});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

export default router;
