// routes/UserRoute.js
import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  checkUserSession,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", checkUserSession);

export default router;