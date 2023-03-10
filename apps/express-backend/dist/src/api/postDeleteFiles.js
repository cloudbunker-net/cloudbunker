"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDeleteFiles = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const prisma_1 = require("../utils/prisma");
const s3 = new client_s3_1.S3Client({
    region: 'eu',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    endpoint: process.env.AWS_END_POINT,
    forcePathStyle: true,
});
const postDeleteFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { filesArray } = req.body;
    if (!filesArray) {
        return res.status(400).json({
            msg: 'No files were selected',
            success: false,
        });
    }
    filesArray.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        // Get the name
        const nameFile = yield prisma_1.prisma.file.findFirst({
            where: {
                id: file.id,
                email: req.user.email,
            },
        });
        if (!nameFile) {
            return res.status(400).json({ msg: `Name "${nameFile.name}" not found`, success: false });
        }
        if (nameFile.isDir === true) {
            // Delete all files in the folder
            const deleteFolder = (folderId) => __awaiter(void 0, void 0, void 0, function* () {
                const folder = yield prisma_1.prisma.file.findFirst({
                    where: {
                        id: folderId,
                    },
                });
                if (folder.childrenIds.length > 0) {
                    // Recursively delete all child folders
                    for (const childId of folder.childrenIds) {
                        yield deleteFolder(childId);
                    }
                }
                if (folder.isDir === false) {
                    // Delete object name from s3
                    const deleteObjectCommand = new client_s3_1.DeleteObjectCommand({
                        Bucket: 'user-files',
                        Key: folder.s3Key,
                    });
                    yield s3.send(deleteObjectCommand);
                }
                // Delete the folder
                yield prisma_1.prisma.file.deleteMany({
                    where: {
                        id: folderId,
                        email: req.user.email,
                    },
                });
                // Update the parent folder
                const parentFolder = yield prisma_1.prisma.file.findFirst({
                    where: {
                        id: folder.parentId,
                    },
                });
                yield prisma_1.prisma.file.updateMany({
                    where: {
                        id: folder.parentId,
                        email: req.user.email,
                    },
                    data: {
                        childrenIds: parentFolder.childrenIds.filter((childId) => childId !== folder.id),
                    },
                });
            });
            yield deleteFolder(file.id);
            res.json({
                msg: 'Folder deleted successfully',
                success: true,
            });
        }
        else {
            // In case if the file entry given is not a directory
            // Delete object name from s3
            const deleteObjectCommand = new client_s3_1.DeleteObjectCommand({
                Bucket: 'user-files',
                Key: nameFile.s3Key,
            });
            yield s3.send(deleteObjectCommand);
            // Update parent folder of the name
            const parentFolder = yield prisma_1.prisma.file.findFirst({
                where: {
                    id: nameFile.parentId,
                },
            });
            yield prisma_1.prisma.file
                .updateMany({
                where: {
                    id: nameFile.parentId,
                    email: req.user.email,
                },
                data: {
                    childrenIds: parentFolder.childrenIds.filter((childId) => childId !== nameFile.id),
                },
            })
                .catch((err) => {
                return res.status(400).json({ msg: err, success: false });
            });
            // Delete the name
            yield prisma_1.prisma.file
                .deleteMany({
                where: {
                    id: nameFile.id,
                    email: req.user.email,
                },
            })
                .catch((err) => {
                return res.status(400).json({ msg: err, success: false });
            });
            yield prisma_1.prisma.file
                .updateMany({
                where: {
                    id: nameFile.parentId,
                    email: req.user.email,
                },
                data: {
                    childrenIds: parentFolder.childrenIds.filter((childId) => childId !== nameFile.id),
                },
            })
                .catch((err) => {
                return res.status(400).json({ msg: err, success: false });
            });
            return res.json({
                msg: 'File deleted successfully',
                success: true,
            });
        }
    }));
});
exports.postDeleteFiles = postDeleteFiles;
//# sourceMappingURL=postDeleteFiles.js.map