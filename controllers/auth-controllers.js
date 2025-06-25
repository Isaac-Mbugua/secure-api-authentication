const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const getHome = (req, res) => {
  res.status(200).json({
    message: "This is the new API",
    creator: "Benard Kariuki",
  });
};

const registerUser = async (req, res) => {
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

module.exports = { getHome, registerUser };
