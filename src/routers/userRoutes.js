const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");


// router.use((req, res, next) => {
//     console.log(`[USER ROUTES] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
//     next();
// });

// GET all users
router.get("/", authMiddleware, userController.getAllUsers);

// GET user by ID
router.get("/:id", authMiddleware, userController.getUserById);

// POST create user
router.post("/", upload.none(), authMiddleware, userController.createUser);

// PUT update user
router.put("/:id", upload.none(), authMiddleware, userController.updateUser);

// DELETE user
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;
