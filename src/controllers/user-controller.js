const User = require("../models/user");

const getProfile = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password, ...safeUser } = user.dataValues;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json({ users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

module.exports = { getProfile, getAllUsers };
