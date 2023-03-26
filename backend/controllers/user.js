const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../utils/errors/not-found-error');
const BadRequestError = require('../utils/errors/bad-request-error');
const UnauthorizedError = require('../utils/errors/unauthorized-error');
const ConflictError = require('../utils/errors/conflict-error');
const { SOME_SECRET_KEY } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send(user.toJSON());
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('A user already exists'));
        return;
      }

      if (error.name === 'ValidationError') {
        next(new BadRequestError('Bad Request'));
        return;
      }

      next(error);
    });
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId, undefined, { runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Bad Request'));

        return;
      }
      if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Not Found'));
        return;
      }
      next(error);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError':
          next(new BadRequestError('Bad Request'));
          break;

        case 'CastError':
          next(new BadRequestError('Bad Request'));
          break;

        case 'DocumentNotFoundError':
          next(new NotFoundError('Not Found'));
          break;

        default:
          next(error);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError':
          next(new BadRequestError('Bad Request'));
          break;

        case 'CastError':
          next(new BadRequestError('Bad Request'));
          break;

        case 'DocumentNotFoundError':
          next(new NotFoundError('Not Found'));
          break;

        default:
          next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SOME_SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    //   res.cookie('jwt', token, {
    //     maxAge: 3600000 * 24 * 7,
    //     httpOnly: true,
    //   }).end();
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Bad Request'));
        return;
      }
      if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Not Found'));
        return;
      }
      next(error);
    });
};
