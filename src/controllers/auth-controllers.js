const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  calculateRisk,
  mapRiskToExpiry,
} = require("../middlewares/calculateRisk");

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
      authCode: null,
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

    if (user.authCode) {
      return res.status(403).json({
        message:
          "Authenticate your account before logging in. Check your email for authentication code.",
      });
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

    const risk = calculateRisk(req);
    const expiry = mapRiskToExpiry(risk);

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expiry,
    });

    return res.status(200).json({
      message: "Login was successful.",
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const otpVerificationHandler = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: "OTP is required." });
  }

  try {
    const user = await User.findOne({ where: { authCode: otp } });

    if (!user) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    await User.update({ authCode: null }, { where: { email: user.email } });
    return res
      .status(200)
      .json({ message: "Authentication successful, proceed to login." });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getHome,
  registerHandler,
  loginHandler,
  otpVerificationHandler,
};
