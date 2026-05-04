import Post from "../models/Post.js";
import Profile from "../models/Profile.js";

// ✅ GET POSTS
export const getPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({ userId });

    if (!profile || !profile.lat || !profile.lng) {
      const posts = await Post.find();
      return res.json(posts);
    }

    const lat = profile.lat;
    const lng = profile.lng;

    const posts = await Post.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
    ]);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE POST (add this to fix your import error)
export const createPost = async (req, res) => {
  try {
    const { title, description, category, urgency, lat, lng } = req.body;

    const newPost = new Post({
      userId: req.user.id,
      title,
      description,
      category,
      urgency,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};