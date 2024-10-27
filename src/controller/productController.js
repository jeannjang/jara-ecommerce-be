import Product from "../models/Product.js";

export const createProduct = async (req, res, next) => {
  try {
    const { sku, size, name, imageUrl, category, description, price, stock } =
      req.body;
    const product = new Product({
      sku,
      size,
      name,
      imageUrl,
      category,
      description,
      price,
      stock,
    });
    await product.save();
    return res.status(200).json({ status: "success", product });
  } catch (error) {
    next(error);
  }
};
