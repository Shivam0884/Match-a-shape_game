// gameController.js
const User = require("../Models/User");

const updateScore = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { score } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (score > user.HighScore) {
      user.HighScore = score;
      await user.save();
    }

    res.json({ success: true, HighScore: user.HighScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateScore }; // ✅ Named export
