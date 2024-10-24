import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    category: { type: Array, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Object, required: true },
    status: { type: String, default: "active" }, // active, inactive
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

const Product = mongoose.model("Product", productSchema);
export default Product;
