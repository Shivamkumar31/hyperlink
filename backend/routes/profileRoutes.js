import express from "express";
import {
  createOrUpdateProfile,
  getProfile,
} from "../controllers/profileController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrUpdateProfile);
router.get("/", protect, getProfile);

export default router;     