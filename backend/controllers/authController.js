import Auth from "../models/Auth.js";
import Profile from "../models/Profile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};



// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const exists = await Auth.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create auth user
    const user = await Auth.create({
      email,
      password: hashed,
    });

    // create empty profile
    await Profile.create({
      userId: user._id,
    });

    res.status(201).json({
      token: generateToken(user._id),
      userId: user._id,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // check if profile exists / completed
    const profile = await Profile.findOne({ userId: user._id });

    res.json({
      token: generateToken(user._id),
      userId: user._id,
      profileCompleted: !!profile?.name, // important flag
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};