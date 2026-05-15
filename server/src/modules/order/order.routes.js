import express from "express";

import { checkout, getOrders } from "./order.controller.js";

import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/checkout", checkout);

router.get("/", getOrders);

export default router;
