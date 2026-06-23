
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const filterTypes = (req, file, cb) => {
  const filetypes = /pdf|docx?|txt|md|csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname || mimetype) { // Changed to OR because some mimetypes are obscure
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

