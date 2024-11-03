import Cart from "../models/Cart.js";

export const addItemToCart = async (req, res, next) => {
  try {
    const { productId, size, qty } = req.body;
    const userId = req.userId;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
      });
      await cart.save();
    }

    const existingItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );
    if (existingItem) {
      return res
        .status(400)
        .json({ status: "fail", message: "Item already exists in cart" });
    }

    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();
    res
      .status(200)
      .json({ status: "success", cart, cartItemQty: cart.items.length });
  } catch (error) {
    next(error);
  }
};

export const getCartItems = async (req, res, next) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: { path: "productId", model: "Product" },
    });

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    next(error);
  }
};
//data: cart.items
