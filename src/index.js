require("dotenv").config();
const express = require("express");
const routeLogger = require('./middlewares/routeLogger');
const app = express();
const PORT = process.env.PORT || 3000;

// Import Routes
const userRoutes = require("./routers/userRoutes");
const authRoutes = require("./routers/authRoutes");


app.use(express.json());
app.use(routeLogger);
// Home
app.get("/", (req, res) => {
  res.send("ExvaHub API is running!");
});

// auth routes
app.use("/api", authRoutes);
// user routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));