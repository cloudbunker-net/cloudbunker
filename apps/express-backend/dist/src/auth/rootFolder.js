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
exports.rootFolderCreate = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function rootFolderCreate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        let rootFolder = yield prisma.file.findMany({
            where: {
                email: user.email,
                name: 'root',
                rootFolder: true,
                isDir: true,
                size: 0,
                s3Key: '',
            },
        });
        // Here we check if root folder exists, if it doesn't
        // we create one
        if (rootFolder.length === 0) {
            const file = yield prisma.file.create({
                data: {
                    email: user.email,
                    name: 'root',
                    rootFolder: true,
                    isDir: true,
                    size: 0,
                    s3Key: '',
                },
            });
            req.rootFolderId = file.id;
        }
        else {
            req.rootFolderId = rootFolder[0].id;
        }
        next();
    });
}
exports.rootFolderCreate = rootFolderCreate;
//# sourceMappingURL=rootFolder.js.map