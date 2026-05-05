import multer from "multer";
import path from "path";

const uploadDirectory = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(extension, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    cb(null, `${Date.now()}-${safeName || "avatar"}${extension}`);
  }
});

export const uploadImages = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed."));
      return;
    }

    cb(null, true);
  }
});

<<<<<<< HEAD
export const uploadAvatarMiddleware = uploadAvatar.single('avatar');

export const uploadProfile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB for larger files
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed."));
      return;
    }

    cb(null, true);
  }
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]);

export const uploadTweetImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed."));
      return;
    }

    cb(null, true);
  }
}).single("image");
=======
export const uploadAvatar = uploadImages;
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
