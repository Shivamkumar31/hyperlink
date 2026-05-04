import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  name: String,
  bio: String,
  location: String,
  lat: Number,
  lng: Number,
  interests: [String],
  profilePic: String,
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);