import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import session from "express-session";
import MongoStore from "connect-mongo";
import productRoutes from "./routes/ProductRoute.js";
import userRoutes from "./routes/UserRoute.js";
import cartRoutes from "./routes/CartRoute.js";
import orderRoutes from "./routes/OrderRoute.js";
import checkoutRoutes from "./routes/CheckoutRoute.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// ✅ REQUIRED FOR DEPLOYMENT: Trust the proxy to handle secure cookies
app.set('trust proxy', 1);

app.use(
  cors({
    // ✅ FIX 1: Use an array for multiple origins
    origin: ["http://localhost:5173", "https://oxygengymequipments.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      // ✅ FIX 2 & 4: Set sameSite and make httpOnly true for security
      sameSite: 'none', // Required for cross-site requests
      secure: true,     // Required when sameSite is 'none'
      httpOnly: true,   // Prevents client-side JS from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/checkout", checkoutRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});