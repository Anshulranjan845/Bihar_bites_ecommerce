// routes/category.routes.js
import express from "express";

import {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller.js";

const router = express.Router();

router.post("/", createCategoryController);
router.get("/", getAllCategoriesController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;
