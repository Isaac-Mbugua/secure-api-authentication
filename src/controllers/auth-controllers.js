const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const getHome = (req, res) => {
  res.status(200).json({
    message: "This is the secure authentication API",
    creator: "Mbugua Isaac",
  });
};

const registerHandler = async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const encryptedPassword = await bcryptjs.hash(password, 12);

    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: encryptedPassword,
      role: role || "user",
    });

    const { password: _, ...safeUser } = createdUser.dataValues;

    res.status(201).json({
      message: "User registered successfully.",
      createdUser: safeUser,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const payload = {
      id: user.id,
      name: user.firstName,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login was successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getHome, registerHandler, loginHandler };
