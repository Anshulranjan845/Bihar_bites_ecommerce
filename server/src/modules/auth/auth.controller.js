import { loginUser, registerUser, loginWithGoogle } from "./auth.service.js";

import { loginSchema, registerSchema } from "./auth.validation.js";

import { setAuthCookie } from "../../utils/setCookies.js";

import prisma from "../../lib/prisma.js";
import { forgotPassword, resetPassword } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const result = await registerUser(validatedData);

    setAuthCookie(res, result.token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",

      data: result.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    setAuthCookie(res, result.token);

    res.status(200).json({
      success: true,
      message: "Login successful",

      data: result.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPasswordHandler = async (req, res) => {
  try {
    const result = await forgotPassword(req.body.email);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPasswordHandler = async (req, res) => {
  try {
    const result = await resetPassword(req.params.token, req.body.password);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await loginWithGoogle(idToken);
    setAuthCookie(res, result.token);
    res.status(200).json({ success: true, message: "Google auth successful", data: result.user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
