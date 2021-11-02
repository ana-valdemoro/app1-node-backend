const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../../config');

const generateJWT = (payload) =>
  jwt.sign(payload, config.jwt.private, {
    expiresIn: config.jwt.expiresIn,
    algorithm: 'RS256',
  });

const verifyJWT = (token) => jwt.verify(token, config.jwt.public, { algorithm: 'RS256' });

const authorize = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) {
      res.status(401).send(error);
    } else if (!user) {
      res.status(401).send(info);
    } else {
      req.user = user;
      req.userType = info;
      return next();
    }

    res.status(401).send(info);
  })(req, res);
};

module.exports = {
  generateJWT,
  verifyJWT,
  authorize,
};
