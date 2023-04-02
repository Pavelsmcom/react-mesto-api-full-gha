const router = require('express').Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/not-found-error');
const { login, createUser } = require('../controllers/user');
const { validateSignIn, validateSignUp } = require('../utils/validation/validation');

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);

router.use('/users', auth, usersRoutes);
router.use('/cards', auth, cardsRoutes);
router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Not Found'));
});

module.exports = router;
