const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controllers");

router.get("/", authController.getHome);
router.post("/api/register", authController.registerUser);

module.exports = router;
