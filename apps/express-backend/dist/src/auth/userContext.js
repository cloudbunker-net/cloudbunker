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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContext = void 0;
const axios_1 = __importDefault(require("axios"));
const userContext = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const response = yield axios_1.default.get('https://dev-82d7cozfjn24fqem.us.auth0.com/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const userInfo = response.data;
        req.user = userInfo; // Set the user object on the request object
        next(); // Pass control to the next middleware function
    }
    catch (e) {
        res.json({ msg: 'There was an error, when getting JWT token.', error: e });
    }
});
exports.userContext = userContext;
//# sourceMappingURL=userContext.js.map