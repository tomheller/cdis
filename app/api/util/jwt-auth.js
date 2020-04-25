const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const dotenv = require('dotenv');
dotenv.config();

const jwtCheck = (url) =>
  jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: url,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
  });
module.exports = jwtCheck;
