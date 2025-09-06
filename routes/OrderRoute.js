import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Get all orders
router.get("/", async (req, res) => {
  try {
   const orders = await Order.find()
  .populate("userId", "name email") // ✅ fetch name & email from User
  .populate("items.productId", "name price images")
  .sort({ createdAt: -1 });


    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ Create new order (temporary before Razorpay integration)
router.post("/create", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentStatus: "pending",
    });

    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get all orders of a user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.productId", "name price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Update order status (for admin later)
router.put("/update/:orderId", async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus },
      { new: true }
    );

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
