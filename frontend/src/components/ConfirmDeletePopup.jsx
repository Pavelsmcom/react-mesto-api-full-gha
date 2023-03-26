import React from 'react';
import PopupWithForm from './PopupWithForm';

function ConfirmDeletePopup({ isOpen, onClose, deleteCard }) {
  return (
    <PopupWithForm name="confirm" title="Вы уверены?" isOpen={isOpen} onClose={onClose}>
      <>
        <button className="popup__save-btn" type="button" name="confirm_btn" onClick={deleteCard}>
          Да
        </button>
      </>
    </PopupWithForm>
  );
}

export default ConfirmDeletePopup;
