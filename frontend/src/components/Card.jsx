import React from 'react';

function Card({ card, onCardClick, onCardLike, onCardDelete, isOwn, isLiked }) {
  const cardLikeButtonClassName = `cards__heart-btn ${isLiked && 'cards__heart-btn_active'}`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleCardDelete() {
    onCardDelete(card._id);
  }

  return (
    <>
      <img className="cards__image" src={card.link} alt={`Изображение ${card.name} не загрузилось`} onClick={handleClick} />
      <div className="cards__footer">
        <h2 className="cards__description">{card.name}</h2>
        <div>
          <button className={cardLikeButtonClassName} type="button" aria-label="Кнопка лайка места" onClick={handleLikeClick}></button>
          <div className="cards__like-counter">{card.likes.length}</div>
        </div>
      </div>
      {isOwn && <button className="cards__remove-btn" type="button" aria-label="Кнопка удаления места" onClick={handleCardDelete} />}
    </>
  );
}

export default Card;
