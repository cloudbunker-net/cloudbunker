const jwks = require('jwks-rsa');
const { expressjwt: jwt } = require('express-jwt');

export const verifyJWT = jwt({
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
