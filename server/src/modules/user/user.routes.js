import express from "express";

import {
  createAddress,
  profile,
  removeAddress,
  updateUserProfile,
  userAddresses,
} from "./user.controller.js";

import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/profile", profile);

router.put("/profile", updateUserProfile);

router.post("/addresses", createAddress);

router.get("/addresses", userAddresses);

router.delete("/addresses/:id", removeAddress);

export default router;
