import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Emergency"],
      default: "Low",
    },

    radius: {
      type: Number, // optional (in KM if you use later)
    },

    expiresAt: {
      type: Date,
    },

    // ✅ GEO LOCATION (CORRECT FORMAT)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// ✅ IMPORTANT: GEO INDEX (MUST HAVE)
postSchema.index({ location: "2dsphere" });

export default mongoose.model("Post", postSchema);