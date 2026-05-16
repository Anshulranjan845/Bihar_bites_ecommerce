// controllers/category.controller.js
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "./category.service.js";

// CREATE
export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE
export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await updateCategory(id, req.body);

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteCategory(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
