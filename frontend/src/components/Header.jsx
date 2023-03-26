import React, { useContext, useState } from 'react';
import Logo from '../images/logo/logo.svg';
import { Route, Routes, Link } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import burgerImage from '../images/burger.png';
import closeImage from '../images/close.svg';

function Header({ logOut, loggedIn }) {
  const currentUser = useContext(CurrentUserContext);

  const [burgerClick, setBurgerClick] = useState(true);

  function handleLogOut(e) {
    e.preventDefault();
    logOut();
    setBurgerClick(true);
  }

  return (
    <header className={burgerClick ? 'header' : 'header header_on-burger-click'}>
      <img className="logo" src={Logo} alt="Логотип Место" />
      <div
        className={
          loggedIn
            ? burgerClick
              ? 'header__container'
              : 'header__container header__container_on-burger-click'
            : 'header__container header__container_display-block'
        }
      >
        <Routes>
          <Route
            path="/sign-in"
            element={
              <Link to="/sign-up" className="header__link">
                Регистрация
              </Link>
            }
          />
          <Route
            path="/sign-up"
            element={
              <Link to="/sign-in" className="header__link">
                Войти
              </Link>
            }
          />
          <Route
            path="/"
            element={
              <>
                <p className="header__text">{currentUser?.email ?? ''}</p>
                <Link to="/sign-in" className={burgerClick ? 'header__link' : 'header__link header__link_on-burger-click'} onClick={handleLogOut}>
                  Выйти
                </Link>
              </>
            }
          />
        </Routes>
      </div>
      <button
        className={loggedIn ? 'header__burger' : 'header__burger header__burger_display-none'}
        type="button"
        onClick={() => setBurgerClick(!burgerClick)}
        style={{
          backgroundImage: `url(${burgerClick ? burgerImage : closeImage})`,
        }}
      />
    </header>
  );
}

export default Header;
