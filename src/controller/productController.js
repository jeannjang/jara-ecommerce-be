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
    const PAGE_SIZE = 4;
    const { page, name } = req.query;
    const condition = name ? { name: { $regex: name, $options: "i" } } : {};
    let query = Product.find(condition).sort({ createdAt: -1 });
    let response = { status: "success" };

    if (page) {
      query = query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.countDocuments(condition);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const products = await query.exec();
    response.products = products;
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
