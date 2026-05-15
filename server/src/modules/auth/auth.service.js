import bcrypt from "bcrypt";

import prisma from "../../lib/prisma.js";

import { generateToken } from "../../utils/generateToken.js";
import crypto from "crypto";

import transporter from "../../config/mail.js";

import { generateResetToken } from "../../utils/generateResetToken.js";
import { env } from "../../config/env.js";

export const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const assignedRole = env.NODE_ENV === "development" ? data.role || "USER" : "USER";

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: assignedRole,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

export const loginUser = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordMatched = await bcrypt.compare(data.password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = generateResetToken();

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      resetPasswordToken: hashedToken,

      resetPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: user.email,

    subject: "Reset Your Password",

    html: `
        <h2>Password Reset</h2>

        <p>Click below to reset password:</p>

        <a href="${resetUrl}">
          Reset Password
        </a>
      `,
  });

  return {
    message: "Reset email sent",
  };
};

export const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,

      resetPasswordExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      password: hashedPassword,

      resetPasswordToken: null,

      resetPasswordExpiry: null,
    },
  });

  return {
    message: "Password reset successful",
  };
};
