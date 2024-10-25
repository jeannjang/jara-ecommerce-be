import User from "../models/User.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, level } = req.body;

    const existedUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existedUser) {
      if (existedUser.name === name && existedUser.email === email) {
        return res.status(400).json({
          status: "fail",
          message: "This account already in use",
        });
      } else if (existedUser.name === name) {
        return res.status(400).json({
          status: "fail",
          message: "This name already in use",
        });
      } else if (existedUser.email === email) {
        return res.status(400).json({
          status: "fail",
          message: "This email already in use",
        });
      }

      return res.status(400).json({
        status: "fail",
        message: "This account already in use",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      level: level || "customer",
    });
    await newUser.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};
