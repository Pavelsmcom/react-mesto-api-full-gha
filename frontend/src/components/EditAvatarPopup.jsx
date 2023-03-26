import React, { useRef, useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, loadingIndicator }) {
  const avatarLinkRef = useRef();

  //validation--------------------------
  const [link, setLink] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(avatarLinkRef.current?.validity.valid);
  }, [link]);
  //----------------------------------
  useEffect(() => {
    avatarLinkRef.current.value = '';
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarLinkRef.current.value,
    });
  }

  function handleClose() {
    onClose();
  }

  return (
    <PopupWithForm name="avatar" title="Обновить аватар" isOpen={isOpen} onClose={handleClose} onSubmit={handleSubmit}>
      <input
        className={avatarLinkRef.current?.validity.valid ? 'popup__input' : 'popup__input popup__input_type_error'}
        type="url"
        placeholder="Ссылка на картинку"
        name="link"
        id="avatar-input"
        required={true}
        ref={avatarLinkRef}
        onChange={(e) => setLink(e.target.value)} // нужно для валидации
        value={link} // нужно для валидации
      />
      <span className="popup__input-error link-error">{avatarLinkRef.current?.validationMessage ?? ''}</span>
      <button disabled={!isValid} className={isValid ? 'popup__save-btn' : 'popup__save-btn popup__save-btn_inactive'} type="submit" name="add_btn">
        {loadingIndicator ? 'Сохранение' : 'Сохранить'}
      </button>
    </PopupWithForm>
  );
}
export default EditAvatarPopup;
