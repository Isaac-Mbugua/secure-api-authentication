const jwt = require("jsonwebtoken");
const sendOtp = require("../utils/sendOtp"); // your reusable OTP function

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const requireAuth = (allowedRoles = []) => {
  return async (req, res, next) => {
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
        try {
          const decoded = jwt.decode(token);
          const email = decoded?.email;
          const name = decoded?.name;

          if (!email) {
            return res.status(401).json({ message: "Invalid token payload" });
          }

          await sendOtp(email, name);

          return res.status(401).json({
            message:
              "Authorization token expired. Verification code sent to your email.",
          });
        } catch (otpError) {
          console.error("OTP send error:", otpError);
          return res
            .status(500)
            .json({ message: "Failed to send verification code" });
        }
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid authorization token" });
      }

      return res.status(401).json({ message: "Authentication failed" });
    }
  };
};

module.exports = requireAuth;
