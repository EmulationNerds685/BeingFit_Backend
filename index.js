import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import session from "express-session";
import MongoStore from "connect-mongo";
import productRoutes from "./routes/ProductRoute.js";
import userRoutes from "./routes/UserRoute.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173" || "https://oxygengymequipments.netlify.app/", // ya jo bhi frontend chal raha hai
    credentials: true,
  })
);
// Middleware
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
      httpOnly: true,
      secure: true, // true rakho agar HTTPS use kar rahe ho
      maxAge: 1000 * 60 * 60 * 24, // 1 din
    },
  })
);

app.use("/products", productRoutes);
app.use("/users", userRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
