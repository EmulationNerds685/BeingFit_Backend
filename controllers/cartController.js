import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Add product to cart
// @route   POST /cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    // With the 'protect' middleware, you can get userId from req.user._id
    const { userId, productId, quantity } = req.body;

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
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};

// @desc    Get user cart
// @route   GET /cart/:userId
// @access  Private
export const getUserCart = async (req, res) => {
  try {
    // Note: It's often safer to use req.user._id from your 'protect' middleware
    // than to pass the userId in the params, to ensure users can only see their own cart.
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
          await cart.save();
          const populatedCart = await cart.populate("items.productId");
          res.json(populatedCart);
        } else {
          res.status(404).json({ message: "Product not in cart" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating cart", error: err.message });
    }
}

// @desc    Remove item from cart
// @route   DELETE /cart/remove
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Error removing item", error: err.message });
    }
};

// @desc    Clear entire user cart
// @route   DELETE /cart/clear/:userId
// @access  Private
export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ message: "Error clearing cart", error: err.message });
    }
};