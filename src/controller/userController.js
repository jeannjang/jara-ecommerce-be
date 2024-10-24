import User from "../models/User.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, level } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ status: "fail", message: "Passwords do not match" });
    }

    const exists = await User.exists({ email });
    if (exists) {
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
