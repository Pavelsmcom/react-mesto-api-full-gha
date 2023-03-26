import React, { useState, useContext, useEffect, useRef } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, loadingIndicator }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const currentUser = useContext(CurrentUserContext);

  //validation--------------------------
  const [isInvalid, setIsInvalid] = useState(false);
  const validNameRef = useRef();
  const validDescriptionRef = useRef();

  useEffect(() => {
    if (validNameRef.current?.validity.valid !== true || validDescriptionRef.current?.validity.valid !== true) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [name, description, isInvalid]);
  // //----------------------------------

  useEffect(() => {
    setName(currentUser?.name ?? '');
    setDescription(currentUser?.about ?? '');
  }, [currentUser, onClose]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm name="edit" title="Редактировать профиль" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <>
        <input
          className={validNameRef.current?.validity.valid ? 'popup__input' : 'popup__input popup__input_type_error'}
          type="text"
          placeholder="Имя"
          name="name"
          required={true}
          minLength={2}
          maxLength={40}
          onChange={handleNameChange}
          value={name}
          ref={validNameRef}
        />
        <span className="popup__input-error name-error">{validNameRef.current?.validationMessage ?? ''}</span>
        <input
          className={validDescriptionRef.current?.validity.valid ? 'popup__input' : 'popup__input popup__input_type_error'}
          type="text"
          placeholder="О себе"
          name="description"
          required={true}
          minLength={2}
          maxLength={200}
          onChange={handleDescriptionChange}
          value={description}
          ref={validDescriptionRef}
        />
        <span className="popup__input-error description-error">{validDescriptionRef.current?.validationMessage ?? ''}</span>
        <button disabled={isInvalid} className={isInvalid ? 'popup__save-btn popup__save-btn_inactive' : 'popup__save-btn'} type="submit" name="edit_btn">
          {loadingIndicator ? 'Сохранение' : 'Сохранить'}
        </button>
      </>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
