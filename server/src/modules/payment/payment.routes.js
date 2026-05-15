import express from "express";

import {
  createPaymentOrder,
  verifyCashfreePayment,
} from "./payment.controller.js";

import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/create-order", createPaymentOrder);

router.post("/verify", verifyCashfreePayment);

export default router;
