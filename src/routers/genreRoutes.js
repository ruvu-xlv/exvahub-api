const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");


// router.use((req, res, next) => {
//     console.log(`[USER ROUTES] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
//     next();
// });

// GET all genres
router.get("/", authMiddleware, genreController.getAllGenres);

// GET genre by ID
router.get("/:id", authMiddleware, genreController.getGenreById);

// POST create genre
router.post("/", upload.none(), authMiddleware, genreController.createGenre);

// PUT update genre
router.put("/:id", upload.none(), authMiddleware, genreController.updateGenre);

// DELETE genre
router.delete("/:id", authMiddleware, genreController.deleteGenre);

module.exports = router;
