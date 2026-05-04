import express from "express";
import * as test from "../controllers/postController.js";
console.log("CONTROLLER:", test);
import { createPost, getPosts } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", protect, getPosts);

export default router;

