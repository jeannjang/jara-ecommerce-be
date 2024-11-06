import mongoose from "mongoose";
import User from "./User.js";
import Product from "./Product.js";
import Cart from "./Cart.js";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    orderNum: { type: String },
    status: { type: String, default: "preparing" },
    totalPrice: { type: Number, required: true, default: 0 },
    shipTo: { type: String, required: true },
    contact: { type: String, required: true },
    items: [orderItemSchema],
  },
  { timestamps: true }
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

orderSchema.post("save", async function (doc) {
  const cart = await Cart.findOne({ userId: this.userId });
  if (cart) {
    await Cart.findByIdAndDelete(cart._id);
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
