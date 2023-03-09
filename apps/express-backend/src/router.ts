import { Router } from "express";
import { getCreateFolder } from "./api/getCreateFolder";
import { getDownloadFileLink } from "./api/getDownloadFileLink";
import { getPublicFileLink } from "./api/getPublicFileLink";
import { getTestAuth } from "./api/getTestAuth";
import { postDeleteFiles } from "./api/postDeleteFiles";
import { postFilesMetadata } from "./api/postFilesMetadata";
import { postMoveName } from "./api/postMoveName";
import { postUploadFile } from "./api/postUploadFile";
import { upload } from "./utils/multer";

// Router
const router = Router();

// Routes
router.get("/protected", getTestAuth);
router.post(
  "/upload",
  upload.fields([{ name: "file" }, { name: "folder" }]),
  postUploadFile
);
router.get("/download", getDownloadFileLink);
router.post("/get-files-metadata", postFilesMetadata);
router.post("/create-folder", getCreateFolder);
router.post("/move-name", postMoveName);
router.post("/delete-files", postDeleteFiles);
// router.get("/get-file-link", getPublicFileLink);

export { router };
