import React from 'react';
import PopupWithForm from './PopupWithForm';

import successAuth from '../images/success.png';
import failAuth from '../images/fail.png';

function InfoTooltip({ isOpen, onClose, serverResponseStatus }) {
  return (
    <PopupWithForm name="successAuth" isOpen={isOpen} onClose={onClose}>
      <img className="popup__info-tooltip-image" src={serverResponseStatus.status ? successAuth : failAuth} alt="test" />
      <p className="popup__info-tooltip-text"> {serverResponseStatus.text}</p>
    </PopupWithForm>
  );
}

export default InfoTooltip;
