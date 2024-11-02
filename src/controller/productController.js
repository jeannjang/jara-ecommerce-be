import Product from "../models/Product.js";

export const createProduct = async (req, res, next) => {
  try {
    const { sku, name, image, category, description, price, stock } = req.body;

    // 존재하는 상품 중에서 sku나 name 중복 체크
    const existingProduct = await Product.findOne({
      isDeleted: false,
      $or: [{ sku }, { name }],
    });

    if (existingProduct) {
      let message = "";
      if (existingProduct.sku === sku && existingProduct.name === name) {
        message = "Both SKU and name are already in use";
      } else if (existingProduct.sku === sku) {
        message = "This SKU is already in use";
      } else {
        message = "This name is already in use";
      }

      return res.status(400).json({
        status: "fail",
        message,
      });
    }

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

    const searchCondition = {
      isDeleted: { $ne: true }, // 삭제되지 않은 상품만 조회
      ...(name ? { name: { $regex: name, $options: "i" } } : {}),
    };

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

export const getProductDetail = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false, // 삭제되지 않은 상품만 조회
    });

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Sorry. Product not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      product,
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

    // 존재하는 상품과의 중복 체크 (자기 자신 제외)
    const existingProduct = await Product.findOne({
      _id: { $ne: productId }, // 현재 수정하려는 상품 제외
      isDeleted: false, // 삭제하지 않은 상품만 체크
      $or: [{ sku }, { name }],
    });

    if (existingProduct) {
      let message = "";
      if (existingProduct.sku === sku && existingProduct.name === name) {
        message = "Both SKU and name are already in use";
      } else if (existingProduct.sku === sku) {
        message = "This SKU is already in use";
      } else {
        message = "This name is already in use";
      }

      return res.status(400).json({
        status: "fail",
        message,
      });
    }

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
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(400).json({
        status: "fail",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
