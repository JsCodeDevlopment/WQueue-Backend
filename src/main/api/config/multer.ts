import multer from "multer";
import path from "path";

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, files, callback) {
      callback(null, path.resolve(__dirname, "../../../..", "uploads"));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
});
