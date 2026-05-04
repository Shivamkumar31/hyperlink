import Profile from "../models/Profile.js";


// ✅ CREATE / UPDATE PROFILE
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { name, bio, location, lat, lng, interests } = req.body;

    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new Profile({ userId: req.user._id });
    }

    profile.name = name;
    profile.bio = bio;
   profile.location = req.body.location;
profile.lat = req.body.lat;
profile.lng = req.body.lng;
    profile.interests = interests;

    await profile.save();

    res.json({
      message: "Profile saved",
      profile,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });

    res.json(profile);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};