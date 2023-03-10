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
exports.getCreateFolder = void 0;
const prisma_1 = require("../utils/prisma");
const getCreateFolder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { folder, parentId } = req.body;
    if (!folder) {
        return res.status(400).json({
            msg: 'No folder/parentId name to create was provided',
            success: false,
        });
    }
    if (!parentId) {
        return res.status(400).json({
            msg: 'No parent folder id was provided',
            success: false,
        });
    }
    const existingFolder = yield prisma_1.prisma.file.findFirst({
        where: {
            AND: [{ name: folder }, { email: req.user.email }, { parentId: parentId }],
        },
    });
    if (existingFolder) {
        return res.status(400).json({
            msg: 'File with same name already exists in the given folder',
            success: false,
        });
    }
    // Create a folder
    const newFolder = yield prisma_1.prisma.file
        .create({
        data: {
            name: folder,
            size: 0,
            email: req.user.email,
            parentId: parentId,
            isDir: true,
            s3Key: '',
        },
    })
        .catch((err) => {
        return res.status(400).json({ msg: err, success: false });
    });
    // Update parent folder
    const parentFolder = yield prisma_1.prisma.file.findFirst({
        where: {
            id: parentId,
        },
    });
    yield prisma_1.prisma.file
        .updateMany({
        where: {
            id: parentId,
            email: req.user.email,
        },
        data: {
            childrenIds: [...parentFolder.childrenIds, newFolder.id],
        },
    })
        .catch((err) => {
        return res.status(400).json({ msg: err, success: false });
    });
    return res.json({
        msg: 'Folder created successfully',
        success: true,
    });
});
exports.getCreateFolder = getCreateFolder;
//# sourceMappingURL=getCreateFolder.js.map