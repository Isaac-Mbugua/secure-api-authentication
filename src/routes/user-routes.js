const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const requireAuth = require("../middlewares/requireAuth");

router.get("/api/profile", requireAuth(), userController.getProfile);
router.get("/api/users", requireAuth(["admin"]), userController.getAllUsers);

module.exports = router;
