import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const SALTROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    level: { type: String, default: "customer" }, // admin, costomer
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, SALTROUNDS);
      this.password = hashedPassword;
      console.log("Password has been hashed!", hashedPassword);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
