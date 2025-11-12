const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");


// router.use((req, res, next) => {
//     console.log(`[USER ROUTES] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
//     next();
// });

// GET all movies
router.get("/", authMiddleware, movieController.getAllMovies);
// GET movie by ID
router.get("/:id", authMiddleware, movieController.getMovieById);
// POST create Movie
router.post("/", authMiddleware, upload.single('thumbnail'), movieController.createMovie);
// UPDATE movie
router.put("/:id", authMiddleware, upload.single('thumbnail'), movieController.updateMovie);
// DELETE movie
router.delete("/:id", authMiddleware, movieController.deleteMovie);

module.exports = router;
