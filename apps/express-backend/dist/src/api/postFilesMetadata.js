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
exports.postFilesMetadata = void 0;
const prisma_1 = require("../utils/prisma");
function postFilesMetadata(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { perPage, page } = req.body;
            const email = req.user.email;
            // Count the total number of files for the given email
            const totalFiles = yield prisma_1.prisma.file.count({
                where: { email },
            });
            // Calculate the offset based on the requested page and items per page
            const offset = (page - 1) * perPage;
            // Get the metadata for the requested page of files
            const files = yield prisma_1.prisma.file.findMany({
                where: { email },
                skip: offset,
                take: perPage,
                orderBy: {
                    modDate: 'asc',
                },
            });
            const totalPages = Math.ceil(totalFiles / perPage);
            // Return the file metadata and pagination information in the response
            return res.json({
                rootFolderId: req.rootFolderId,
                files,
                success: true,
            });
        }
        catch (ex) {
            console.log(ex);
        }
    });
}
exports.postFilesMetadata = postFilesMetadata;
//# sourceMappingURL=postFilesMetadata.js.map