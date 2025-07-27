const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const requireAuth = require("../middlewares/requireAuth");

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */

router.get("/api/profile", requireAuth(), userController.getProfile);
router.get("/api/users", requireAuth(["admin"]), userController.getAllUsers);

module.exports = router;
