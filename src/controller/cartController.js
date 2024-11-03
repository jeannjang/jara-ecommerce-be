import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

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

export const getCartItemCount = async (req, res, next) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId });

    // 카트가 없거나 아이템이 없는 경우 0 반환
    const count = cart ? cart.items.length : 0;

    res.status(200).json({
      status: "success",
      count,
    });
  } catch (error) {
    next(error);
  }
};

// 기존 deleteCartItem과 updateCartItemQty 함수 수정
export const deleteCartItem = async (req, res, next) => {
  try {
    const { userId } = req;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    // 업데이트된 카트 정보 반환
    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    res.status(200).json({
      status: "success",
      cart: updatedCart,
      count: updatedCart.items.length, // 카트 아이템 수도 함께 반환
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItemQty = async (req, res, next) => {
  try {
    const { userId } = req;
    const { itemId } = req.params;
    const { qty } = req.body;

    if (!qty || qty < 1) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid quantity",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        status: "fail",
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(cartItem.productId);
    if (!product || product.stock[cartItem.size] < qty) {
      return res.status(400).json({
        status: "fail",
        message: "Out of stock",
      });
    }

    cartItem.qty = qty;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    res.status(200).json({
      status: "success",
      cart: updatedCart,
      count: updatedCart.items.length, // 카트 아이템 수도 함께 반환
    });
  } catch (error) {
    next(error);
  }
};
