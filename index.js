import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import productRoutes from "./routes/ProductRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Middleware
app.use(express.json());
app.use("/products", productRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
