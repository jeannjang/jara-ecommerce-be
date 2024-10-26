import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "No account found with these details",
      });
    }

    const match = user && (await bcrypt.compare(password, user.password));

    if (!match) {
      return res
        .status(400)
        .json({ status: "fail", message: "Incorrect email or password" });
    }

    const token = await user.generateAuthToken();
    return res.status(200).json({ status: "success", user, token });
  } catch (error) {
    next(error);
  }
};
