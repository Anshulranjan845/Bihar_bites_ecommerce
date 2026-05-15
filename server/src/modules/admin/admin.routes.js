import express from "express";

import {
  allOrders,
  allUsers,
  changeOrderStatus,
  dashboardStats,
  lowStockProducts,
  recentOrders,
} from "./admin.controller.js";

import {
  authorizeRoles,
  verifyToken,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("ADMIN"));

router.get("/dashboard-stats", dashboardStats);

router.get("/recent-orders", recentOrders);

router.get("/low-stock-products", lowStockProducts);

router.get("/orders", allOrders);

router.patch("/orders/:id/status", changeOrderStatus);

router.get("/users", allUsers);

export default router;
