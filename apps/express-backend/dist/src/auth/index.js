"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
// ? We may convert these into import statements
// ? but I think we have some problems with that
const jwks = require('jwks-rsa');
const { expressjwt: jwt } = require('express-jwt');
// Verify JWT sent by the user
exports.verifyJWT = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: 'abcd',
    issuer: `https://dev-82d7cozfjn24fqem.us.auth0.com/`,
    algorithms: ['RS256'],
}).unless({ path: ['/api/'] });
//# sourceMappingURL=index.js.map