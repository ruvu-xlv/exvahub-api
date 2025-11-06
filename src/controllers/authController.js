// controllers/authController.js
const { User, Role } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const response = require("../utils/responseHelper");

const authController = {

  // LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.error(res, 400, "Email and password are required");
      }

      // Find user
      const user = await User.findOne({
        where: { email },
        include: {
          association: 'role',
          attributes: ['name']
        }
      });

      if (!user) {
        return response.error(res, 401, "Invalid credentials");
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return response.error(res, 401, "Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role.name
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      // Remove password from response
      const userResponse = { ...user.toJSON() };
      delete userResponse.password;
      delete userResponse.role_id;

      response.success(res, 200, "Login successful", {
        user: userResponse,
        token
      });

    } catch (error) {
      response.error(res, 500, error.message);
    }
  },
}

module.exports = authController;