require('dotenv').config();
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../utils/errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// module.exports = (req, res, next) => {
//   const token = req.cookies.jwt;
//   let payload;

//   try {
//     payload = jwt.verify(token, SOME_SECRET_KEY);
//   } catch (err) {
//     next(new UnauthorizedError('Required authorization'));
//     return;
//   }
//   req.user = payload;
//   next();
// };
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Required authorization'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError('Required authorization'));
    return;
  }
  req.user = payload;
  next();
};
