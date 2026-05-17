import express from "express";
import { checkout, getOrders, getAdminOrders } from "./order.controller.js";
import { verifyToken, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);
router.post("/checkout", checkout);
router.get("/", getOrders);
router.get("/admin/all", authorizeRoles("ADMIN"), getAdminOrders);

export default router;
