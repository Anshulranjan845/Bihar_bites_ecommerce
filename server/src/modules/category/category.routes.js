import express from "express";

import { create, getAll } from "./category.controller.js";

const router = express.Router();

router.post("/", create);

router.get("/", getAll);

export default router;
