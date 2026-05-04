export const getPosts = async (req, res) => {
  try {
    const { lat, lng } = req.query;
const radius = parseInt(req.query.radius) || 50000;
    // ✅ fallback: if no location → return latest posts
    if (!lat || !lng) {
      const posts = await Post.find({
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      return res.json(posts);
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    // ✅ validate numbers
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({
        message: "Invalid location coordinates",
      });
    }

    // ✅ geo query
    const posts = await Post.find({
      expiresAt: { $gt: new Date() },

      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parsedLng, parsedLat],
          },
          $maxDistance: 50000, // 5km
        },
      },
    }).sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};