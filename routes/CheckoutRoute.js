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
    const { amount, userId, cartItems } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const newOrder = new Order({
      userId,
      // FIX 1: Use the correct field name, e.g., 'items'
      items: cartItems.map((item) => ({
        productId: item.productId._id, // Ensure you save just the ID
        quantity: item.quantity,
      })),
      totalAmount: amount,
      // FIX 2: Correctly save the Razorpay order ID to the 'paymentId' field
      razorpayOrderId: order.id,
      // Use the field names from your schema
      paymentStatus: "pending",
      orderStatus: "processing", // Or whatever your default is
    });

    await newOrder.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});
// Verify payment
// In your /checkout/verify route
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // ... (signature verification logic remains the same) ...
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Find the order using its 'paymentId'
      await Order.findOneAndUpdate(
        {  razorpayOrderId: razorpay_order_id },
        // FIX: Update the correct field name, e.g., 'paymentStatus' to 'paid'
        { paymentStatus: "paid" }
      );
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Verification error" });
  }
});
export default router;
