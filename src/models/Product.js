import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Array, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Object, required: true },
    status: { type: String, default: "active" }, // active, inactive
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 기존 인덱스 삭제 및 새 인덱스 생성
productSchema.pre("save", async function (next) {
  try {
    // 컬렉션이 존재하는 경우에만 인덱스 삭제 실행
    if (mongoose.connection.collections["products"]) {
      await mongoose.connection.collections["products"].dropIndexes();
    }
    next();
  } catch (error) {
    next(error);
  }
});

// 새로운 복합 인덱스 생성
productSchema.index({ sku: 1, isDeleted: 1 });
productSchema.index({ name: 1, isDeleted: 1 });

productSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

const Product = mongoose.model("Product", productSchema);
export default Product;
