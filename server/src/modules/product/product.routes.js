import express from "express";

import {
  create,
  getAll,
  getSingle,
  update,
  remove,
} from "./product.controller.js";
import upload from "../../middlewares/upload.middleware.js";
import {
  verifyToken,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAll);

router.get("/:id", getSingle);

router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN"),
  upload.single("image"),
  create,
);

router.put("/:id", verifyToken, authorizeRoles("ADMIN"), update);

router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), remove);

export default router;
