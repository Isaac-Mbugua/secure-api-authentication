const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controllers");

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get home
 *     description: Returns a simple welcome message.
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Create an account using first name, last name, email, phone, password, and role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

router.get("/", authController.getHome);
router.post("/api/register", authController.registerHandler);
router.post("/api/login", authController.loginHandler);

module.exports = router;
