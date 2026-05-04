export const createPost = async (req, res) => {
  try {
    const { title, description, category, urgency, radius, duration, lat, lng } = req.body;

    // 🔴 Validation
    if (!title || !description) {
      return res.status(400).json({ message: "Title & description required" });
    }

    if (!lat || !lng) {
      return res.status(400).json({ message: "Location required" });
    }

    console.log("REQ BODY:", req.body);
    // ✅ FIX: expiry logic
    const durationMap = {
      "24h": 24,
      "48h": 48,
      "7d": 168,
    };

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationMap[duration]);

    // ✅ CREATE POST
    const post = await Post.create({
      userId: req.user._id,
      title,
      description,
      category,
      urgency,
      radius,
      expiresAt,

      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    res.json(post);

  } catch (err) {
    console.error(err); // 👈 IMPORTANT
    res.status(500).json({ error: err.message });
  }
};