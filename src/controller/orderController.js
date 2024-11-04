import Order from "../models/Order.js";
import { randomStringGenerator } from "../utils/randomString.js";

export const createOrder = async (req, res, next) => {
  try {
    const { userId } = req;
    const { shipTo, contact, totalPrice, orderList } = req.body;

    // 새로운 주문 생성
    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();

    res.status(200).json({
      status: "success",
      orderNum: newOrder.orderNum,
    });
  } catch (error) {
    next(error);
  }
};
