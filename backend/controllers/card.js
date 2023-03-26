const Card = require('../models/card');
const NotFoundError = require('../utils/errors/not-found-error');
const BadRequestError = require('../utils/errors/bad-request-error');
const ForbiddenError = require('../utils/errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Bad Request'));
        return;
      }
      next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== _id) {
        next(new ForbiddenError('Can`t delete others posts'));
      } else {
        Card.findByIdAndDelete(cardId)
          .then(() => {
            res.send({ message: 'Post delete' });
          });
      }
    })
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

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
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

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
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
