const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./utils/db");
const app = express();
dotenv.config();

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
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

startServer();
