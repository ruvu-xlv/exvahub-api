// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController")
const upload = require("../middlewares/upload");

router.post("/register", upload.none(), userController.createUser);
router.post("/login", upload.none(), authController.login);

module.exports = router;