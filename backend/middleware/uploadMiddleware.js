import multer from "multer";
import path from "path";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

const filterTypes = (req, file, cb) => {
  const filetypes = /pdf|docx?|txt|md|csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Only PDF, Word and text documents are allowed!"));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => filterTypes(req, file, cb),
});
