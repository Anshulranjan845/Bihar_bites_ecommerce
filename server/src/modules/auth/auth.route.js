import express from "express";

import { getMe, login, logout, register } from "./auth.controller.js";

import { verifyToken } from "../../middlewares/auth.middleware.js";

import {
  forgotPasswordHandler,
  resetPasswordHandler,
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", verifyToken, getMe);

router.post("/forgot-password", forgotPasswordHandler);

router.post("/reset-password/:token", resetPasswordHandler);

export default router;
