export const getPosts = async (req, res) => {
  try {
    const { lat, lng, category, urgency } = req.query;
    const radius = parseInt(req.query.radius) || 50000;

    // ✅ Common filter
    const matchStage = {
      expiresAt: { $gt: new Date() },
    };

    // ✅ Apply filters
    if (category) matchStage.category = category;
    if (urgency) matchStage.urgency = urgency;

    let posts = [];

    // ✅ CASE 1: No location → global feed
    if (!lat || !lng) {
      posts = await Post.find(matchStage)
        .sort({ createdAt: -1 });

      return res.json(posts);
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({
        message: "Invalid location coordinates",
      });
    }

    // ✅ CASE 2: GEO QUERY WITH DISTANCE
    posts = await Post.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parsedLng, parsedLat],
          },
          distanceField: "distance", // 🔥 IMPORTANT
          maxDistance: radius,
          spherical: true,
        },
      },
      {
        $match: matchStage,
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    // ✅ CASE 3: fallback → global if no nearby
    if (!posts || posts.length === 0) {
      posts = await Post.find(matchStage)
        .sort({ createdAt: -1 });
    }

    res.json(posts);

  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};