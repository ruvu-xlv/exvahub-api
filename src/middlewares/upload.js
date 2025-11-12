const multer = require("multer");
const path = require("path");
const fs = require("fs");

function getUploadPath(req) {
    const parts = req.originalUrl.split("/").filter(Boolean); 
    const folderName = parts[1] || "misc";

    const uploadPath = path.join(__dirname, `../uploads/${folderName}`);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    return uploadPath;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getUploadPath(req));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;