const cardsRoutes = require('express').Router();

const { validateCreateCard, validateCardId } = require('../utils/validation/validation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', validateCreateCard, createCard);
cardsRoutes.delete('/:cardId', validateCardId, deleteCard);
cardsRoutes.put('/:cardId/likes', validateCardId, likeCard);
cardsRoutes.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardsRoutes;
