import multer from "multer"; // works if @types/multer is installed
import path from "path";
import fs from "fs";

const uploadDirectory = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(file.mimetype) || ext === ".pdf" || ext === ".docx") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed."));
  }
};


export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
