import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./config/db.js";
import productRoutes from "./routes/ProductRoute.js";
import userRoutes from "./routes/userRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import checkoutRoutes from "./routes/checkoutRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
connectDB();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://oxygengymequipments.netlify.app", "https://beingfitadmin.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is up and running!" });
});
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/checkout", checkoutRoutes);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});