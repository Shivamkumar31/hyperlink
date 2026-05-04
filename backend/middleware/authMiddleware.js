import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await Auth.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "No token" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
};