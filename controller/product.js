import bufferGenerator from "../utilis/bufferGenerator.js";
import TryCatch from "../utilis/TryCatch.js";
import cloudinary from "cloudinary";
import { Product } from "../models/Product.js";

export const createProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description, category, price, stock } = req.body;

  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({
      message: "no file to upload",
    });

  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);

    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  const product = await Product.create({
    title,
    description,
    category,
    price,
    stock,
    images: uploadedImage,
  });

  res.status(201).json({
    message: "Prodcut is created",
    product,
  });
});

export const getAllProduct = TryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;

  const filter = {};

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  const limit = 8;
  const skip = (page - 1) * limit;
  let sortOption = { createdAt: -1 };

  if (sortByPrice) {
    if (sortByPrice === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sortByPrice === "highTolow") {
      sortOption = { price: -1 };
    }
  }
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  const categories = await Product.distinct("category");
  const newProduct = await Product.find().sort("-createdAt").limit(4);

  const countProduct = await Product.countDocuments();

  const totalPages = Math.ceil(countProduct / limit);

  res.json({
    products,
    categories,
    totalPages,
    newProduct,
  });
});

export const getSingleProduct = TryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id);

  const relatedProduct = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  res.json({
    product,
    relatedProduct,
  });
});

export const updateProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description, category, price, stock } = req.body;

  const updateField = {};

  if (title) updateField.title = title;
  if (description) updateField.description = description;
  if (category) updateField.category = category;
  if (price) updateField.price = price;
  if (stock) updateField.stock = stock;

  const updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateField,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateField)
    return res.status(404).json({
      message: "Product not found",
    });

  res.json({
    message: "Product is updated",
    updateProduct,
  });
});

export const updateProductImage = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { id } = req.params;
  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({
      message: "no file to upload",
    });

  const product = await Product.findById(id);

  if (!product)
    return res.status(404).json({
      message: "Product not found",
    });

  const oldImages = product.images || [];

  for (const img of oldImages) {
    if (img.id) {
      await cloudinary.v2.uploader.destroy(img.id);
    }
  }

  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);

    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  product.images = uploadedImage;

  await product.save();

  res.status(200).json({
    message: "Image is updated",
    product,
  });
});
