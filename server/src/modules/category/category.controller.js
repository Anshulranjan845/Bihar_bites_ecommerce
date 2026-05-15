import { createCategory, getAllCategories } from "./category.service.js";

import { createCategorySchema } from "./category.validation.js";

export const create = async (req, res) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await createCategory(validatedData);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
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
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
