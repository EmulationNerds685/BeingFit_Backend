import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, userId, cartItems } = req.body; // amount in paise

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay works with paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save pending order in DB
    const newOrder = new Order({
      userId,
      products: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: amount,
      paymentId: order.id, // store Razorpay order id
      status: "pending",
    });

    await newOrder.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// Verify payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update order in DB
      await Order.findOneAndUpdate(
        { paymentId: razorpay_order_id },
        { status: "paid" }
      );
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Verification error" });
  }
});

export default router;
