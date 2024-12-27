import multer, { StorageEngine } from "multer";
import { Request } from "express";
import { CallbackError } from "mongoose";

// Define storage configuration for multer
const storage: StorageEngine = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: CallbackError | null, destination: string) => void
  ) {
    cb(null, "./public/temp"); // Specify the destination folder
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: CallbackError | null, filename: string) => void
  ) {
    cb(null, file.originalname); // Save the file with its original name
  },
});

// Export the multer instance
export const upload = multer({
  storage,
});
