import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { randomStringGenerator } from "../utils/randomString.js";

export const createOrder = async (req, res, next) => {
  try {
    const { userId } = req;
    const { shipTo, contact, totalPrice, items } = req.body;

    // 1. 재고 확인
    const stockCheckResults = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          return {
            isValid: false,
            message: `상품 ID ${item.productId}를 찾을 수 없습니다.`,
          };
        }

        const currentStock = Number(product.stock[item.size]) || 0;
        if (currentStock < item.qty) {
          return {
            isValid: false,
            message: `${product.name}의 ${item.size} 사이즈 재고가 부족합니다. (현재 재고: ${currentStock})\n`,
          };
        }

        return {
          isValid: true,
          product,
          item,
        };
      })
    );

    // 재고 부족 체크
    const insufficientStocks = stockCheckResults.filter(
      (result) => !result.isValid
    );
    if (insufficientStocks.length > 0) {
      const errorMessage = insufficientStocks
        .map((result) => result.message)
        .join("");
      return res.status(400).json({
        status: "fail",
        message: errorMessage.trim(),
      });
    }

    // 2. 재고 업데이트
    await Promise.all(
      stockCheckResults.map(async ({ product, item }) => {
        const currentStock = Number(product.stock[item.size]);
        const newStock = { ...product.stock };
        // newStock[item.size] = currentStock - item.qty;
        newStock[item.size] = String(currentStock - item.qty); // 재고 타입 스키마에 맞게 문자열로 변환

        await Product.findByIdAndUpdate(
          product._id,
          { $set: { stock: newStock } },
          { new: true }
        );
      })
    );

    // 3. 주문 생성
    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: items.map((item) => ({
        productId: item.productId,
        price: item.price,
        size: item.size,
        qty: item.qty,
      })),
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();
    // 카트 비우기는 Order 모델의 post-save 미들웨어에서 처리

    res.status(200).json({
      status: "success",
      orderNum: newOrder.orderNum,
      cartItemCount: 0, // 미들웨어에서 카트가 비워질 것이므로 0으로 설정
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(400).json({
      status: "fail",
      message: error.message || "주문 처리 중 오류가 발생했습니다.",
    });
  }
};

// (MyPage 사용자용)
export const getOrder = async (req, res, next) => {
  try {
    const { userId } = req;

    const orders = await Order.find({ userId })
      .populate("userId", "-password") // 비밀번호 제외하고 유저 정보 가져오기
      .populate("items.productId") // 상품 정보 가져오기
      .sort({ createdAt: -1 }); // 최신순 정렬

    if (!orders) {
      return res.status(404).json({
        status: "fail",
        message: "No orders found",
      });
    }

    res.status(200).json({
      status: "success",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// 관리자용 전체 주문 목록 조회 (페이지네이션 포함)
export const getOrderList = async (req, res, next) => {
  try {
    const PAGE_SIZE = 5;
    const { page = 1, ordernum } = req.query;

    const searchCondition = {
      ...(ordernum ? { orderNum: { $regex: ordernum, $options: "i" } } : {}),
    };

    const skipAmount = (page - 1) * PAGE_SIZE;

    // 주문 목록 조회와 전체 개수 카운트를 병렬로 실행
    const [orders, totalCount] = await Promise.all([
      Order.find(searchCondition)
        .populate("userId", "-password")
        .populate("items.productId")
        .sort({ createdAt: -1 })
        .skip(skipAmount)
        .limit(PAGE_SIZE),
      Order.countDocuments(searchCondition),
    ]);

    const totalPageNum = Math.ceil(totalCount / PAGE_SIZE);

    res.status(200).json({
      status: "success",
      orders,
      totalPageNum,
    });
  } catch (error) {
    next(error);
  }
};
