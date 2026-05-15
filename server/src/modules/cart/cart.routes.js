import express from "express";

import {
  addItem,
  clearUserCart,
  getUserCart,
  removeItem,
  updateItem,
} from "./cart.controller.js";

import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getUserCart);

router.post("/", addItem);

router.put("/:id", updateItem);

router.delete("/:id", removeItem);

router.delete("/", clearUserCart);

export default router;
