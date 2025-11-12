const { User, Role } = require("../models");
const response = require("../utils/responseHelper");
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Helper function untuk hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;

        // Build where condition untuk search
        const whereCondition = {};
        if (search) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { username: { [Op.like]: `%${search}%` } }
            ];
        }

        const users = await User.findAndCountAll({
            attributes: { exclude: ['password', 'role_id'] },
            include: {
                association: 'role',
                attributes: ['name']
            },
            where: whereCondition,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        // Pagination info
        const pagination = {
            page: parseInt(page),
            limit: parseInt(limit),
            total: users.count,
            totalPages: Math.ceil(users.count / limit),
            hasNext: page < Math.ceil(users.count / limit),
            hasPrev: page > 1
        };

        response.success(res, 200, "Users retrieved successfully", users.rows, pagination);
    } catch (err) {
        response.error(res, 500, err.message);
    }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: {
                association: 'role',
                attributes: ['name']
            }
        });
        if (!user) return response.error(res, 404, "User not found");

        response.success(res, 200, "User retrieved successfully", user);
    } catch (err) {
        response.error(res, 500, err.message);
    }
};

// Create new user
exports.createUser = async (req, res) => {
    try {
        const { name, username, email, password, role_id } = req.body;

        const requiredFields = { name, username, email, password };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return response.error(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
            }
        }

        let finalRoleId = role_id;

        // Jika role_id tidak provided, cari role 'user' di database
        if (!finalRoleId) {
            const userRole = await Role.findOne({ where: { name: 'user' } });
            if (!userRole) return response.error(res, 500, "Default user role not found");
            finalRoleId = userRole.id;
        }

        // Validasi apakah role_id exists di database
        const roleExists = await Role.findByPk(finalRoleId);
        if (!roleExists) return response.error(res, 400, "Invalid role_id");

        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            role_id: finalRoleId
        });

        // Re-fetch user dengan role untuk response konsisten
        const createdUser = await User.findByPk(newUser.id, {
            attributes: { exclude: ['password', 'role_id'] },
            include: {
                association: 'role',
                attributes: ['name']
            }
        });

        response.success(res, 201, "User created successfully", createdUser);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return response.error(res, 400, "Email or username already exists");
        }
        response.error(res, 500, err.message);
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { name, username, email, password, role_id } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) return response.error(res, 404, "User not found");

        // Prepare update data
        const updateData = { name, username, email, role_id };

        // Only hash password if provided
        if (password) {
            updateData.password = await hashPassword(password);
        }

        await user.update(updateData);

        // Re-fetch user with role for consistent response
        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'role_id'] },
            include: {
                association: 'role',
                attributes: ['name']
            }
        });

        response.success(res, 200, "User updated successfully", updatedUser);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return response.error(res, 400, "Email or username already exists");
        }
        response.error(res, 500, err.message);
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return response.error(res, 404, "User not found");

        await user.destroy();
        response.success(res, 200, "User deleted successfully");
    } catch (err) {
        response.error(res, 500, err.message);
    }
};