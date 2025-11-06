const jwt = require("jsonwebtoken");
const response = require("../utils/responseHelper");

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return response.error(res, 401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (error) {
    response.error(res, 400, "Invalid token.");
  }
};

module.exports = authMiddleware;