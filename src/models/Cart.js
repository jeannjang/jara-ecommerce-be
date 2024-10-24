import mongoose from "mongoose";
import User from "./User.js";
import Product from "./Product.js";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

cartSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
