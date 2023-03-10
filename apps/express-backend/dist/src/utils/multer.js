"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multerS3 = require('multer-s3');
const multer = require('multer');
const uuid = require('uuid');
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({
    region: 'eu',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    endpoint: process.env.AWS_END_POINT,
    forcePathStyle: true,
});
// What this middlewear does, is uploads, form-data file into s3 bucket
// It uploads it in the folder with the email of the user
// It omits extensions, and just saves a file with uuid v4 as name
// ? I believe it to be safer that way and faster, not sure if that is true
exports.upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'user-files',
        acl: 'private',
        limits: { fileSize: 4 * 1024 * 1024 * 1024 * 1024 },
        key: function (req, file, cb) {
            const uniqueFileName = uuid.v4();
            const keyName = `${req.user.email}/${uniqueFileName}`;
            cb(null, keyName);
        },
    }),
    dest: './temp',
});
//# sourceMappingURL=multer.js.map