"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
// API endpoints
const getCreateFolder_1 = require("./api/getCreateFolder");
const getDownloadFileLink_1 = require("./api/getDownloadFileLink");
const getTestAuth_1 = require("./api/getTestAuth");
const postDeleteFiles_1 = require("./api/postDeleteFiles");
const postFilesMetadata_1 = require("./api/postFilesMetadata");
const postMoveName_1 = require("./api/postMoveName");
const postUploadFile_1 = require("./api/postUploadFile");
// Middlewear for uploading files
// we apply it /upload only here
const multer_1 = require("./utils/multer");
// Router
const router = (0, express_1.Router)();
exports.router = router;
// Routes
router.get('/protected', getTestAuth_1.getTestAuth);
router.post('/upload', multer_1.upload.fields([{ name: 'file' }, { name: 'folder' }]), postUploadFile_1.postUploadFile);
router.get('/download', getDownloadFileLink_1.getDownloadFileLink);
router.post('/get-files-metadata', postFilesMetadata_1.postFilesMetadata);
router.post('/create-folder', getCreateFolder_1.getCreateFolder);
router.post('/move-name', postMoveName_1.postMoveName);
router.post('/delete-files', postDeleteFiles_1.postDeleteFiles);
//# sourceMappingURL=router.js.map