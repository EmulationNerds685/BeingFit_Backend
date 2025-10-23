import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order and a corresponding local order
// @route   POST /checkout/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    // SECURITY FIX: Get userId from the session (from 'protect' middleware)
    const userId = req.user._id;
    const { amount, cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paisa, ensure it's an integer
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create an order in our database
    const newOrder = new Order({
      userId, // Use the secure userId from the session
      items: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalAmount: amount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    await newOrder.save();

    res.json({ success: true, order: razorpayOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// @desc    Verify Razorpay payment and update order status
// @route   POST /checkout/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment data missing" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find the order and update payment status
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Here you would also clear the user's cart
      // We need to import the Cart model
      // import Cart from "../models/Cart.js";
      // await Cart.findOneAndDelete({ userId: order.userId });

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Verification error" });
  }
};
