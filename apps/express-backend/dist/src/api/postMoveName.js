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
exports.postMoveName = void 0;
const prisma_1 = require("../utils/prisma");
const postMoveName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, parentId, endParentId } = req.body;
    if (!name) {
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
    if (!endParentId) {
        return res.status(400).json({
            msg: 'No end parent folder id was provided',
            success: false,
        });
    }
    const existingFolder = yield prisma_1.prisma.file.findFirst({
        where: {
            AND: [{ name: name }, { email: req.user.email }, { parentId: endParentId }],
        },
    });
    if (existingFolder) {
        return res.status(400).json({
            msg: 'File/Folder with same name already exists in the given folder',
            success: false,
        });
    }
    // Update parentId of the name
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
            childrenIds: parentFolder.childrenIds.filter((childId) => childId !== name),
        },
    })
        .catch((err) => {
        return res.status(400).json({ msg: err, success: false });
    });
    // Update endParentId of the name
    const endParentFolder = yield prisma_1.prisma.file.findFirst({
        where: {
            id: endParentId,
        },
    });
    yield prisma_1.prisma.file
        .updateMany({
        where: {
            id: endParentId,
            email: req.user.email,
        },
        data: {
            childrenIds: [...endParentFolder.childrenIds, name],
        },
    })
        .catch((err) => {
        return res.status(400).json({ msg: err, success: false });
    });
    // Update name
    yield prisma_1.prisma.file
        .updateMany({
        where: {
            id: name,
            email: req.user.email,
        },
        data: {
            parentId: endParentId,
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
exports.postMoveName = postMoveName;
//# sourceMappingURL=postMoveName.js.map