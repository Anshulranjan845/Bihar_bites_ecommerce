import { createCategory, getAllCategories, updateCategory, deleteCategory } from "./category.service.js";

export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const updated = await updateCategory(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    await deleteCategory(req.params.id, req.body?.reassignedCategoryId);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(err.code === "CATEGORY_REASSIGN_REQUIRED" ? 409 : 400).json({
      success: false,
      message: err.message,
      code: err.code,
      meta: err.meta,
    });
  }
};
