import Product from "../models/Product.js";

export const createProduct = async (req, res, next) => {
  try {
    const { sku, name, image, category, description, price, stock } = req.body;
    const product = new Product({
      sku,
      name,
      image,
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

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ status: "success", products });
  } catch (error) {
    next(error);
  }
};
