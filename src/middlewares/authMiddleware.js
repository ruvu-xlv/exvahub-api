const jwt = require("jsonwebtoken");
const { User } = require("../models");
const response = require("../utils/responseHelper");

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return response.error(res, 401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    const user = await User.findByPk(decoded.userId);
    if (!user) return response.error(res, 401, "User not found");

    req.user = user; 
    next();  
  } catch (error) {
    response.error(res, 400, "Invalid token.");
  }
};

module.exports = authMiddleware;
