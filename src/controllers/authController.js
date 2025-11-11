// controllers/authController.js
const { User, Role } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const response = require("../utils/responseHelper");

const authController = {

  // REGISTER
  register: async (req, res) => {
    try {
      const { name, username, email, password } = req.body;

      if (!name || !username || !email || !password) {
        return response.error(res, 400, "All fields are required");
      }

      // Check if email or username already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return response.error(res, 400, "Email already in use");
      }

      // Find role id for "user"
      const role = await Role.findOne({ where: { name: "user" } });
      if (!role) {
        return response.error(res, 500, "Default user role not found");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        role_id: role.id
      });

      const createdUser = await User.findOne({
        where: { id: newUser.id },
        include: {
          association: 'role', 
          attributes: ['name']
        }
      });

      // Remove sensitive fields
      const userResponse = { ...createdUser.toJSON() };
      delete userResponse.password;
      delete userResponse.role_id;

      response.success(res, 200, "Register successful", {
        user: userResponse
      });

    } catch (error) {
      response.error(res, 500, error.message);
    }
  },


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