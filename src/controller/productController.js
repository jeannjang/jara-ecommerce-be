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

//백엔드에서 url 쿼리를 통해 데이터를 가져올 때 사용하는 함수
export const getProducts = async (req, res, next) => {
  try {
    const { page, name } = req.query;
    const condition = name ? { name: { $regex: name, $options: "i" } } : {};
    let query = Product.find(condition);

    const products = await query.exec();
    return res.status(200).json({ status: "success", products });
  } catch (error) {
    next(error);
  }
};
