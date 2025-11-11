const multer = require("multer");

// Simpan file di memori (kalau cuma kirim teks, ini aman)
const storage = multer.memoryStorage();

// Middleware
const upload = multer({ storage });

module.exports = upload;
