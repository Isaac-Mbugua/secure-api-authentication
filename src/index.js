const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./utils/db");
const app = express();
dotenv.config();

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const swaggerDocs = require("./swagger");
const rateLimit = require("express-rate-limit");

const allowedOrigins = [
  "http://localhost:4200",
  "https://secure-api-ui.vercel.app",
];

const limit = rateLimit({
  window: 60 * 1000,
  limit: 100,
  message: { error: "Too many requests, please try again later." },
});

app.use(limit);
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(authRoutes);
app.use(userRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync();
    console.log("Database synced.");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

swaggerDocs(app);
startServer();
