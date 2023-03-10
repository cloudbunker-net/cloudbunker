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
exports.addUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function addUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        let localUser = yield prisma.user.findFirst({
            where: { email: user.email },
        });
        if (!localUser) {
            const newUser = yield prisma.user.create({
                data: {
                    email: user.email,
                },
            });
            // Here we pass the database user as req.localUser
            // so we can access it later in the API endpoints
            // ! Notice, auth0 user and local user are not the same
            // they do share the same information, but they are stored in
            // different places
            req.localUser = newUser;
        }
        else {
            req.localUser = localUser;
        }
        next();
    });
}
exports.addUser = addUser;
//# sourceMappingURL=addUser.js.map