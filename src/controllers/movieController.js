const { Genre, Movie } = require("../models");
const response = require("../utils/responseHelper");
const { Op } = require('sequelize');
const fs = require("fs");
const path = require("path");

exports.getAllMovies = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;

        const whereCondition = {};
        if (search) {
            whereCondition[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
            ];
        }

        const movies = await Movie.findAndCountAll({
            attributes: { exclude: ['genre_id', 'created_by'] },
            include: [
                {
                    association: 'genre',
                    attributes: ['name']
                },
                {
                    association: 'createdBy',
                    attributes: ['username']
                },
            ],
            where: whereCondition,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        const pagination = {
            page: parseInt(page),
            limit: parseInt(limit),
            total: movies.count,
            totalPages: Math.ceil(movies.count / limit),
            hasNext: page < Math.ceil(movies.count / limit),
            hasPrev: page > 1
        };

        response.success(res, 200, "Users retrieved successfully", movies.rows, pagination);
    } catch (err) {
        response.error(res, 500, err.message);

    }
}

// Get single movie by ID
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id, {
            attributes: { exclude: ['genre_id', 'created_by'] },
            include: [
                {
                    association: 'genre',
                    attributes: ['name']
                },
                {
                    association: 'createdBy',
                    attributes: ['username']
                },
            ],
        });
        if (!movie) return response.error(res, 404, "Movie not found");

        response.success(res, 200, "Movie retrieved successfully", movie);
    } catch (err) {
        response.error(res, 500, err.message);
    }
}

// Create new movie
exports.createMovie = async (req, res) => {
    try {
        const { title, description, year, type, status, genre_id } = req.body;
        const created_by = req.user?.id;

        const folderName = req.originalUrl.split("/")[2] || "misc";
        const thumbnail = req.file ? `/uploads/${folderName}/${req.file.filename}` : null;

        const requiredFields = { title, description, year, type, status, genre_id, created_by, thumbnail };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) return response.error(res, 400, `${key} is required`);
        }

        const genreExists = await Genre.findByPk(genre_id);
        if (!genreExists) return response.error(res, 400, "Invalid genre_id");

        const newMovie = await Movie.create({
            title,
            description,
            year,
            thumbnail,
            type,
            status,
            genre_id,
            created_by,
        });

        const createdMovie = await Movie.findByPk(newMovie.id, {
            attributes: { exclude: ["genre_id", "created_by"] },
            include: [
                {
                    association: "genre",
                    attributes: ["name"]
                },
                {
                    association: "createdBy",
                    attributes: ["username"]
                },
            ],
        });

        return response.success(res, 201, "Movie created successfully", createdMovie);
    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            return response.error(res, 400, "Movie already exists");
        }
        response.error(res, 500, err.message);
    }
}

// Update movie
exports.updateMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const { title, description, year, type, status, genre_id } = req.body;
        const userId = req.user?.id;

        const movie = await Movie.findByPk(movieId);
        if (!movie) return response.error(res, 404, "Movie not found");

        let thumbnail = movie.thumbnail;

        if (req.file) {
            if (movie.thumbnail) {
                const oldPath = path.join(__dirname, "../uploads", movie.thumbnail.replace(/^\/uploads\//, ""));
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const folderName = req.originalUrl.split("/")[2] || "misc";
            thumbnail = `/uploads/${folderName}/${req.file.filename}`;
        }

        if (genre_id) {
            const genreExists = await Genre.findByPk(genre_id);
            if (!genreExists) return response.error(res, 400, "Invalid genre_id");
        }

        await movie.update({
            title: title ?? movie.title,
            description: description ?? movie.description,
            year: year ?? movie.year,
            thumbnail,
            type: type ?? movie.type,
            status: status ?? movie.status,
            genre_id: genre_id ?? movie.genre_id,
            created_by: userId ?? movie.created_by
        });

        const updatedMovie = await Movie.findByPk(movieId, {
            attributes: { exclude: ['genre_id', 'created_by'] },
            include: [
                {
                    association: 'genre',
                    attributes: ['name']
                },
                {
                    association: 'createdBy',
                    attributes: ['username']
                },
            ],
        });

        response.success(res, 200, "Movie updated successfully", updatedMovie);
    } catch (err) {
        response.error(res, 500, err.message);
    }
};

// Delete movie
exports.deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findByPk(movieId);
        if (!movie) return response.error(res, 404, "Movie not found");

        if (movie.thumbnail) {
            const oldPath = path.join(__dirname, "../uploads", movie.thumbnail.replace(/^\/uploads\//, ""));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await movie.destroy();
        response.success(res, 200, "Movie deleted successfully");
    } catch (err) {
        response.error(res, 500, err.message);
    }
}