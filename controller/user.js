import TryCatch from "../utilis/TryCatch.js";
import { OTP } from "../models/Otp.js";
import sendOtp from "../utilis/sendOtp.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const subject = "ShopEasy App";

  const otp = Math.floor(Math.random() * 1000000);

  const prevOtp = await OTP.findOne({
    email,
  });

  if (prevOtp) {
    await prevOtp.deleteOne();
  }

  await sendOtp({ email, subject, otp });

  await OTP.create({ email, otp });

  res.json({
    message: "otp send to your email",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const haveOtp = await OTP.findOne({
    email,
    otp,
  });

  if (!haveOtp) {
    return res.status(400).json({
      message: "Invalid Otp",
    });
  }

  let user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();

    res.json({
      message: "user is Logged In",
      token,
      user,
    });
  } else {
    user = await User.create({
      email,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();

    res.json({
      message: "user is Logged In",
      token,
      user,
    });
  }
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json(user);
});
