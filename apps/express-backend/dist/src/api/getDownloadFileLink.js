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
exports.getDownloadFileLink = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const prisma_1 = require("../utils/prisma");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = new client_s3_1.S3Client({
    region: 'eu',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    endpoint: process.env.AWS_END_POINT,
    forcePathStyle: true,
});
const getDownloadFileLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { fileName } = req.body;
    if (!fileName) {
        return res.status(400).json({ message: 'File name missing', success: false });
    }
    const file = yield prisma_1.prisma.file.findFirst({
        where: { name: fileName, email: user.email },
    });
    if (!file) {
        return res.status(404).json({ message: 'File not found', success: false });
    }
    const command = new client_s3_1.GetObjectCommand({
        Bucket: 'user-files',
        Key: file.s3Key,
        ResponseContentDisposition: `attachment; filename="${file.name}"`,
    });
    // Expiration time is set to 60 seconds for presigned link
    const url = yield getSignedUrl(s3, command, { expiresIn: 60 });
    return res.json({
        msg: 'Pre-signed link for download has been generated',
        url: url,
        fileName: file.name,
        size: file.size,
        success: true,
    });
});
exports.getDownloadFileLink = getDownloadFileLink;
//# sourceMappingURL=getDownloadFileLink.js.map