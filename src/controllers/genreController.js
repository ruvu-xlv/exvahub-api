const { Genre } = require("../models");
const response = require("../utils/responseHelper");
const { Op } = require("sequelize");

// Get all genres with pagination
exports.getAllGenres = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;

        // Build where condition untuk search
        const whereCondition = {};
        if (search) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
            ];
        }

        const genres = await Genre.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        const pagination = {
            page: parseInt(page),
            limit: parseInt(limit),
            total: genres.count,
            totalPages: Math.ceil(genres.count / limit),
            hasNext: page < Math.ceil(genres.count / limit),
            hasPrev: page > 1,
        };

        response.success(res, 200, "Genres retrieved successfully", {
            genres: genres.rows,
            pagination,
        });
    } catch (err) {
        response.error(res, 500, err.message);
    }
};

// Get single genre by ID
exports.getGenreById = async (req, res) => {
    try {
        const genre = await Genre.findByPk(req.params.id);
        if (!genre) return response.error(res, 404, "Genre not found");

        response.success(res, 200, "Genre retrieved successfully", genre);
    } catch (err) {
        response.error(res, 500, err.message);
    }
};

// Create new genre
exports.createGenre = async (req, res) => {
    try {
        const { name } = req.body;

        const requiredFields = { name };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return response.error(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
            }
        }

        const newGenre = await Genre.create({ name });
        response.success(res, 201, "Genre created successfully", newGenre);
    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            return response.error(res, 400, "Genre already exists");
        }
        response.error(res, 500, err.message);
    }
};

// Update genre
exports.updateGenre = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return response.error(res, 400, "Name is required and must be a string");
        }

        const genre = await Genre.findByPk(req.params.id);
        if (!genre) return response.error(res, 404, "Genre not found");

        await genre.update({ name });
        response.success(res, 200, "Genre updated successfully", genre);
    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            return response.error(res, 400, "Genre already exists");
        }
        response.error(res, 500, err.message);
    }
};

// Delete genre
exports.deleteGenre = async (req, res) => {
    try {
        const genre = await Genre.findByPk(req.params.id);
        if (!genre) return response.error(res, 404, "Genre not found");

        await genre.destroy();
        response.success(res, 200, "Genre deleted successfully");
    } catch (err) {
        response.error(res, 500, err.message);
    }
};
