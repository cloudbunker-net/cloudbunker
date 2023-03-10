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
exports.postUploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const getStorageLimit_1 = require("../utils/getStorageLimit");
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
const getObjectSize = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const headObject = new client_s3_1.HeadObjectCommand(params);
    const response = yield s3.send(headObject);
    const objectSize = response.ContentLength;
    return objectSize;
});
const postUploadFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.parentId = req.body.parentId;
        if (!req.body.parentId) {
            return res.json({ msg: 'No parent folder selected', success: false });
        }
        // check if the parent folder exists
        const parentFolder = yield prisma_1.prisma.file.findFirst({
            where: {
                id: req.body.parentId,
                email: req.user.email,
            },
        });
        const multerFile = req.files.file[0];
        if (!parentFolder) {
            // delete object from s3
            const deleteObjectCommand = new client_s3_1.DeleteObjectCommand({
                Bucket: 'user-files',
                Key: multerFile.key,
            });
            yield s3.send(deleteObjectCommand);
            return res.status(400).json({
                msg: 'Parent folder not found',
                success: false,
            });
        }
        // Reliably get file size
        let fileSize;
        const command = {
            Bucket: 'user-files',
            Key: multerFile.key,
        };
        try {
            fileSize = getObjectSize(command);
        }
        catch (error) {
            res.status(500).json({ msg: 'Error getting file size', success: false });
        }
        fileSize.then((data) => __awaiter(void 0, void 0, void 0, function* () {
            multerFile.size = data;
            /* Start: Basic checks */
            const deleteObjectCommand = new client_s3_1.DeleteObjectCommand({
                Bucket: 'user-files',
                Key: multerFile.key,
            });
            if (!multerFile.size) {
                yield s3.send(deleteObjectCommand);
                return res.status(400).json({
                    msg: 'No file was uploaded',
                    success: false,
                });
            }
            /* End: Basic checks */
            /* Start: Check if user has exceeded storage limit */
            const storageLimit = yield (0, getStorageLimit_1.getStorageLimit)(req.localUser.plan);
            const userFilesSize = yield prisma_1.prisma.file.aggregate({
                _sum: {
                    size: true,
                },
                where: {
                    email: req.user.email,
                },
            });
            if (userFilesSize._sum.size + multerFile.size > storageLimit) {
                return res.status(400).json({
                    msg: 'You have exceeded your storage limit',
                    success: false,
                });
            }
            /* End: Check if user has exceeded storage limit */
            /* Start: Check if the same file already exists in the same folder */
            if (req.body.parentId) {
                const existingFile = yield prisma_1.prisma.file.findFirst({
                    where: {
                        AND: [{ name: multerFile.originalname }, { email: req.user.email }, { parentId: req.body.parentId }],
                    },
                });
                if (existingFile) {
                    return res.status(400).json({
                        msg: 'File with same name already exists in the given folder',
                        success: false,
                    });
                }
            }
            /* End: Check if the same file already exists in the same folder */
            /* Start: Add file metadata to the database */
            const file = yield prisma_1.prisma.file
                .create({
                data: {
                    name: multerFile.originalname,
                    size: multerFile.size,
                    email: req.user.email,
                    parentId: req.body.parentId,
                    s3Key: multerFile.key,
                },
            })
                .catch((error) => {
                return res.json({ msg: error, success: false });
            });
            const parentFolder = yield prisma_1.prisma.file.findFirst({
                where: {
                    id: req.body.parentId,
                },
            });
            const updatedFile = yield prisma_1.prisma.file.updateMany({
                where: {
                    id: req.body.parentId,
                    email: req.user.email,
                },
                data: {
                    childrenIds: [...parentFolder.childrenIds, file.id],
                },
            });
            /* End: Add file metadata to the database */
            return res.json({
                msg: 'File uploaded successfully',
                file: req.file,
                parentId: req.body.parentId,
                success: true,
            });
        }));
    }
    catch (error) {
        return res.status(500).json({ msg: 'Some error:', success: false });
    }
});
exports.postUploadFile = postUploadFile;
//# sourceMappingURL=postUploadFile.js.map