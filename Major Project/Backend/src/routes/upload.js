import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `file-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed"));
    }
  },
});

const r = Router();

// Handle multiple images or single image with any field name
r.post("/", upload.any(), (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "No file was uploaded" });
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const base = `${protocol}://${host}`;

    const uploaded = files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      mimetype: f.mimetype,
      url: `${base}/uploads/${f.filename}`,
      relativeUrl: `/uploads/${f.filename}`,
    }));

    return res.status(201).json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      data: {
        url: uploaded[0].url,
        urls: uploaded.map((u) => u.url),
        files: uploaded,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "File upload failed" });
  }
});

export default r;

