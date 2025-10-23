import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
export const addToCart = async (req, res) => {
  try {

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();

    const populatedCart = await cart.populate("items.productId");
    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};
export const getUserCart = async (req, res) => {
  try {

    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {

      return res.json({ _id: null, userId, items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};
export const updateCartItem = async (req, res) => {
  try {

    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
        return res.status(400).json({ message: "Invalid quantity. Must be at least 1." });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = numQuantity;
      await cart.save();
      const populatedCart = await cart.populate("items.productId");
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: "Product not in cart" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating cart", error: err.message });
  }
};
export const removeFromCart = async (req, res) => {
  try {

    const userId = req.user._id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    const populatedCart = await cart.populate("items.productId");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
};
export const clearCart = async (req, res) => {
  try {

    const userId = req.user._id;

    await Cart.findOneAndDelete({ userId: userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart", error: err.message });
  }
};