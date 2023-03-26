import React from 'react';

function ImagePopup({ card, name, onClose }) {
  if (card !== null) {
    return (
      <div className={`popup popup_type_${name} ${card ? 'popup_opened' : ''}`} onClick={onClose}>
        <figure className="popup__image-container" onClick={(evt) => evt.stopPropagation()}>
          <img className="popup__image" alt={`Изображение ${card.name} не загрузилось`} src={card.link} />
          <button className="popup__close-btn" type="button" aria-label="Кнопка закрытия попапа" onClick={onClose} />
          <figcaption className="popup__image-description">{card.name}</figcaption>
        </figure>
      </div>
    );
  }
}

export default ImagePopup;
