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

//url 쿼리를 통해 데이터를 가져오는 함수
export const getProducts = async (req, res, next) => {
  try {
    const PAGE_SIZE = 4;
    const { page, name } = req.query;

    const searchCondition = name
      ? { name: { $regex: name, $options: "i" } }
      : {};

    const baseQuery = Product.find(searchCondition).sort({ createdAt: -1 });

    if (page) {
      const skipCount = (page - 1) * PAGE_SIZE;

      // 두 쿼리 병렬 실행
      const [totalItemNum, products] = await Promise.all([
        Product.countDocuments(searchCondition),
        baseQuery.skip(skipCount).limit(PAGE_SIZE).exec(),
      ]);

      return res.status(200).json({
        status: "success",
        totalPageNum: Math.ceil(totalItemNum / PAGE_SIZE),
        products,
      });
    }

    const products = await baseQuery.exec();
    return res.status(200).json({
      status: "success",
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { sku, name, image, category, description, price, stock, status } =
      req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { sku, name, image, category, description, price, stock, status },
      { new: true }
    );

    if (!product) {
      return res.status(400).json({
        status: "fail",
        message: "Product unavailable",
      });
    }
    return res.status(200).json({ status: "success", product });
  } catch (error) {
    next(error);
  }
};
