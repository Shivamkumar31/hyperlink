import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";

//app.use("/api/posts", postRoutes);
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));