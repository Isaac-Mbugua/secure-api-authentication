const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const requireAuth = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No authentication token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (
        allowedRoles.length &&
        (!decoded.role || !allowedRoles.includes(decoded.role))
      ) {
        return res.status(403).json({ message: "Unauthorized access." });
      }

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Authorization token expired login and try again",
        });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid authorization token" });
      }
      return res.status(401).json({ message: "Authentication failed" });
    }
  };
};

module.exports = requireAuth;
