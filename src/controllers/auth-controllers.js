const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const getHome = (req, res) => {
  res.status(200).json({
    message: "This is the new API",
    creator: "Benard Kariuki",
  });
};

const registerHandler = async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  let role = req.body.role;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!role) {
    role = "user";
  }

  const encryptedPassword = await bcryptjs.hash(password, 12);

  const userInfo = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    password: encryptedPassword,
    role: role,
  };

  try {
    const createdUser = await User.create(userInfo);
    const { password: _, ...safeUser } = createdUser.dataValues;
    res.json({
      message: "User created successfully.",
      safeUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.json({ error: "Invalid email or password" });
    return;
  }
  const isPasswordCorrect = await bcryptjs.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.json({ error: "Invalid email or password" });
    return;
  }

  const payload = {
    id: user.id,
    name: user.firstname,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login was successful.", token: token });
};

module.exports = { getHome, registerHandler, loginHandler };
