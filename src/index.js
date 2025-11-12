require("dotenv").config();
const cors = require("cors");
const express = require("express");
const routeLogger = require('./middlewares/routeLogger');
const app = express();
const startServer = require("./services/server");
const PORT = process.env.PORT || 3000;
const path = require("path");


// Import Routes
const userRoutes = require("./routers/userRoutes");
const authRoutes = require("./routers/authRoutes");
const genreRoutes = require("./routers/genreRoutes");
const movieRoutes = require("./routers/movieRoutes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routeLogger);
// Home
app.get("/", (req, res) => {
  res.send("ExvaHub API is running!");
});


// uplods
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// auth routes
app.use("/api", authRoutes);

// user routes
app.use("/api/users", userRoutes);
// genre routes
app.use("/api/genres", genreRoutes);
// movie routes
app.use("/api/movies", movieRoutes);

startServer(app, PORT);
