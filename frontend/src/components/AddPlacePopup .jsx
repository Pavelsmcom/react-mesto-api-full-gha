import React, { useState, useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace, loadingIndicator }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  //validation--------------------------
  const [isInvalid, setIsInvalid] = useState(false);
  const validNameRef = useRef();
  const validLinkRef = useRef();

  useEffect(() => {
    if (!validNameRef.current?.validity.valid || !validLinkRef.current?.validity.valid) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [name, link, isInvalid]);
  //----------------------------------

  useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name,
      link,
    });
  }

  function handleClose() {
    onClose();
  }

  return (
    <PopupWithForm name="add" title="Новое место" isOpen={isOpen} onClose={handleClose} onSubmit={handleSubmit}>
      <>
        <input
          className={validNameRef.current?.validity.valid ? 'popup__input' : 'popup__input popup__input_type_error'}
          type="text"
          placeholder="Название"
          name="name"
          required={true}
          minLength={2}
          maxLength={30}
          value={name}
          ref={validNameRef}
          onChange={handleNameChange}
        />
        <span className="popup__input-error name-error">{validNameRef.current?.validationMessage ?? ''}</span>
        <input
          className={validLinkRef.current?.validity.valid ? 'popup__input' : 'popup__input popup__input_type_error'}
          type="url"
          placeholder="Ссылка на картинку"
          name="link"
          id="email-input"
          required={true}
          value={link}
          ref={validLinkRef}
          onChange={handleLinkChange}
        />
        <span className="popup__input-error link-error">{validLinkRef.current?.validationMessage ?? ''}</span>
        <button disabled={isInvalid} className={isInvalid ? 'popup__save-btn popup__save-btn_inactive' : 'popup__save-btn'} type="submit" name="add_btn">
          {loadingIndicator ? 'Создание' : 'Создать'}
        </button>
      </>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
