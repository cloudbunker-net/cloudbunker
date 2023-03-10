"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const router_1 = require("./router");
const addUser_1 = require("./auth/addUser");
const auth_1 = require("./auth");
const userContext_1 = require("./auth/userContext");
const rootFolder_1 = require("./auth/rootFolder");
const app = (0, express_1.default)();
exports.app = app;
// * Order of the middlewears should be preserved
// * userContext -> addUser -> rootFolderCreate
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(auth_1.verifyJWT);
app.use(userContext_1.userContext);
// Creating user in database on the first login
app.use(addUser_1.addUser);
// Creating root folder in the database on the first login
app.use(rootFolder_1.rootFolderCreate);
// Routes
app.use('/api', router_1.router);
app.listen(3000, () => console.log('Server started on port 3000'));
//# sourceMappingURL=index.js.map