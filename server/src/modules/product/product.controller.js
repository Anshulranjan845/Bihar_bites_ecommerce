import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getSingleProductBySlug,
  updateProduct,
} from "./product.service.js";
import { uploadToCloudinary } from "../../utils/UploadToCloudinary.js";

import { createProductSchema } from "./product.validation.js";

export const create = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);

      imageUrl = uploadedImage.secure_url;
    }

    const validatedData = createProductSchema.parse({
      ...req.body,

      price: Number(req.body.price),

      stock: Number(req.body.stock),

      isFeatured: req.body.isFeatured === "true",

      isAvailable: req.body.isAvailable === "true",

      image: imageUrl,
    });

    const product = await createProduct(validatedData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const products = await getAllProducts(req.query);

    res.status(200).json({
      success: true,
      ...products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingle = async (req, res) => {
  try {
    const product = await getSingleProduct(req.params.id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleBySlug = async (req, res) => {
  try {
    const product = await getSingleProductBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
