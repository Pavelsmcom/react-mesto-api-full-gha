import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import openEye from '../images/open_eye.svg';
import closeEye from '../images/close_eye.svg';

function Register({ handleRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  //validation--------------------------
  const [isInvalid, setIsInvalid] = useState(false);
  const [validationEmailReset, setValidationEmailReset] = useState(false);
  const [validationPasswordReset, setValidationPasswordReset] = useState(false);
  const validEmailRef = useRef();
  const validPasswordRef = useRef();

  useEffect(() => {
    if (validEmailRef.current?.validity.valid !== true || validPasswordRef.current?.validity.valid !== true) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [email, password, isInvalid]);
  // //----------------------------------

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setValidationEmailReset(true);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setValidationPasswordReset(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    handleRegister({ password, email });
  }

  return (
    <main className="content">
      <section className="auth">
        <h2 className="auth__header">Регистрация</h2>
        <form name="register" noValidate={true} onSubmit={handleSubmit}>
          <input
            className={validationEmailReset ? (validEmailRef.current?.validity.valid ? 'auth__input' : 'auth__input auth__input_type_error') : 'auth__input'}
            type="email"
            placeholder="Email"
            name="email"
            required={true}
            minLength={2}
            maxLength={40}
            onChange={handleEmailChange}
            value={email}
            ref={validEmailRef}
          />
          <span className="auth__input-error email-error">{validationEmailReset ? validEmailRef.current?.validationMessage ?? '' : ''}</span>
          <div className="auth__input-container">
            <input
              className={
                validationPasswordReset ? (validPasswordRef.current?.validity.valid ? 'auth__input' : 'auth__input auth__input_type_error') : 'auth__input'
              }
              type={isVisiblePassword ? 'text' : 'password'}
              placeholder="Пароль"
              name="password"
              required={true}
              minLength={4}
              maxLength={12}
              onChange={handlePasswordChange}
              value={password}
              ref={validPasswordRef}
            />
            <button
              className="auth__show-password"
              type="button"
              onClick={() => setIsVisiblePassword(!isVisiblePassword)}
              style={{
                backgroundImage: `url(${isVisiblePassword ? closeEye : openEye})`,
              }}
            />
          </div>
          <span className="auth__input-error password-error">{validationPasswordReset ? validPasswordRef.current?.validationMessage ?? '' : ''}</span>
          <button disabled={isInvalid} className={isInvalid ? 'auth__btn auth__save-btn_inactive' : 'auth__btn'} type="submit" name="edit_btn">
            Зарегистрироваться
          </button>
          <p className="auth__text">
            Уже зарегистрированы?{' '}
            <Link to="/sign-in" className="auth__link">
              Войти
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
