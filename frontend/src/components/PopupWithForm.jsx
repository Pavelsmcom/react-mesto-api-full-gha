import React from 'react';

function PopupWithForm({ name, title, isOpen, onClose, children, onSubmit }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`} onMouseDown={onClose}>
      <div className="popup__container" onMouseDown={(evt) => evt.stopPropagation()}>
        <h2 className="popup__header">{title}</h2>
        <form className="popup__form" name={`form_${name}`} noValidate="" onSubmit={onSubmit}>
          {children}
        </form>
        <button className="popup__close-btn" type="button" aria-label="Кнопка закрытия попапа" onMouseDown={onClose} />
      </div>
    </div>
  );
}

export default PopupWithForm;
