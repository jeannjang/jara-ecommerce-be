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

export const deleteCartItem = async (req, res, next) => {
  try {
    const { userId } = req;
    const { itemId } = req.params; // URL에서 카트 아이템 ID를 받음

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found",
      });
    }

    // 해당 아이템 cart.items 배열에서 제거
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    // updated카트 정보 반환
    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    res.status(200).json({
      status: "success",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};
