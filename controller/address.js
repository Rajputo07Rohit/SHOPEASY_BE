import { Addres } from "../models/Address.js";
import TryCatch from "../utilis/TryCatch.js";

export const addAddress = TryCatch(async (req, res) => {
  const { address, phone } = req.body;
  console.warn(address, phone);
  await Addres.create({
    address,
    phone,
    user: req.user._id,
  });
  res.status(201).json({
    message: "Address saved",
  });
});

export const getAllAddress = TryCatch(async (req, res) => {
  const allAddress = await Addres.find({ user: req.user._id });

  res.json(allAddress);
});

export const getSingleAddress = TryCatch(async (req, res) => {
  const address = await Addres.findById(req.params.id);

  res.json(address);
});

export const deleteAddress = TryCatch(async (req, res) => {
  const address = await Addres.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  await address.deleteOne();
  res.json({
    message: "address Deleted",
  });
});
