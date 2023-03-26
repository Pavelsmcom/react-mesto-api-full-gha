// paveltest@ya.ru
// 123456789
// _id: "63e51d7fd4567c00131e681f"
// token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M…zNTZ9.s44N8R8hyAgEGP6wthcPU_C3EZP3rTO14yo9CvY_0Vc'

import React, { useState, useEffect, useCallback } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import AddPlacePopup from './AddPlacePopup ';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import Register from './Register';
import Login from './Login';
import ProtectedRouteElement from './ProtectedRoute';
import PageNotFound from './PageNotFound';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/Api.js';
import InfoTooltip from './InfoTooltip';
import { apiAuth } from '../utils/ApiAuth.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  const [selectedCard, selectCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [loadingEditProfilePopupIndicator, setLoadingEditProfilePopupIndicator] = useState(false);
  const [loadingAddPlacePopupIndicator, setLoadingAddPlacePopupIndicator] = useState(false);
  const [loadingEditAvatarPopupIndicator, setLoadingEditAvatarPopupIndicator] = useState(false);

  const [deletedCardId, setDeletedCardId] = useState('');

  const [isCardLoading, setIsCardLoading] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  const [serverResponseStatus, setServerResponseStatus] = useState({ status: true, text: '' });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (loggedIn) {
        try {
          setIsCardLoading(true);
          const [userData, cardsData] = await Promise.all([api.getUserInfo(), api.getInitialCards()]);
          const { name, about, avatar, cohort, _id } = userData;
          setCurrentUser((user) => ({ ...user, avatar: avatar, cohort: cohort, name: name, about: about, _id: _id }));
          setCards(cardsData);
        } catch (error) {
          console.log(error.message);
        } finally {
          setIsCardLoading(false);
        }
      }
    })();
  }, [loggedIn]);

  useEffect(() => {
    (async () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        try {
          const data = await apiAuth.checkToken(jwt);
          setCurrentUser((user) => ({ ...user, email: data.data.email }));
          setLoggedIn(true);
          navigate('/', { replace: true });
        } catch (error) {
          console.log(error.message);
        }
      }
    })();
  }, [navigate]);

  // Close popups by ESC --------------------------------------------------------------
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAllPopups();
    }
  }, []);

  useEffect(() => {
    const isAnyPopupOpened = isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || isConfirmDeletePopupOpen || selectedCard;
    if (isAnyPopupOpened) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, isConfirmDeletePopupOpen, selectedCard, handleKeyDown]);
  // --------------------------------------------------------------------------------

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    selectCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    selectCard(null);
    setIsConfirmDeletePopupOpen(false);
    setIsInfoTooltipOpen(false);
  }

  async function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    try {
      const newCard = await api.changeLike(card._id, isLiked);
      setCards((prevState) => prevState.map((c) => (c._id === card._id ? newCard : c)));
    } catch (error) {
      console.log(error.message);
    }
  }

  function removeCardFromPage(cardId) {
    setCards((prevState) => prevState.filter((c) => c._id !== cardId));
  }

  function handleOpenPopupDeleteConfirmation(cardId) {
    setDeletedCardId(cardId);
    setIsConfirmDeletePopupOpen(true);
  }

  async function handleCardDelete() {
    try {
      await api.deleteCard(deletedCardId);
      removeCardFromPage(deletedCardId);
      closeAllPopups();
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleUpdateUser(userInfo) {
    try {
      setLoadingEditProfilePopupIndicator(true);
      await api.setUserInfo(userInfo);
      setCurrentUser({ ...currentUser, name: userInfo.name, about: userInfo.about });
      closeAllPopups();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingEditProfilePopupIndicator(false);
    }
  }

  async function handleUpdateAvatar(avatarLink) {
    try {
      setLoadingEditAvatarPopupIndicator(true);
      await api.setAvatar(avatarLink.avatar);
      setCurrentUser({ ...currentUser, avatar: avatarLink.avatar });
      closeAllPopups();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingEditAvatarPopupIndicator(false);
    }
  }

  async function handleAddPlace(place) {
    try {
      setLoadingAddPlacePopupIndicator(true);
      const newCard = await api.addCard(place);
      setCards([newCard, ...cards]);
      closeAllPopups();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingAddPlacePopupIndicator(false);
    }
  }

  // authorization --------------------------------------------------------------
  async function handleLogin(user) {
    try {
      const data = await apiAuth.login(user);
      if (data.token) {
        setLoggedIn(true);
        localStorage.setItem('jwt', data.token);
        navigate('/', { replace: true });
        setCurrentUser((user) => ({ ...user, email: user.email }));
      }
    } catch (error) {
      setServerResponseStatus({ status: false, text: 'Что-то пошло не так! Попробуйте ещё раз.' });
      setIsInfoTooltipOpen(true);
      console.log(error.message);
    }
  }

  async function handleRegister(user) {
    try {
      await apiAuth.register(user);
      setServerResponseStatus({ status: true, text: 'Вы успешно зарегистрировались!' });
      setIsInfoTooltipOpen(true);
      navigate('/sign-in', { replace: true });
    } catch (error) {
      setServerResponseStatus({ status: false, text: 'Что-то пошло не так! Попробуйте ещё раз.' });
      setIsInfoTooltipOpen(true);
      console.log(error.message);
    }
  }

  function logOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    navigate('/sign-in', { replace: true });
  }
  // ----------------------------------------------------------------------------

  return (
    <div className="App">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header logOut={logOut} loggedIn={loggedIn} />
          <Routes>
            <Route path="/sign-in" element={<Login handleLogin={handleLogin} />} />
            <Route path="/sign-up" element={<Register handleRegister={handleRegister} />} />
            <Route
              path="/"
              element={
                <ProtectedRouteElement loggedIn={loggedIn}>
                  <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleOpenPopupDeleteConfirmation}
                    isCardLoading={isCardLoading}
                    cards={cards}
                  />
                </ProtectedRouteElement>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            loadingIndicator={loadingEditProfilePopupIndicator}
          />
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} loadingIndicator={loadingAddPlacePopupIndicator} />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            loadingIndicator={loadingEditAvatarPopupIndicator}
          />
          <ImagePopup name="picture" card={selectedCard} onClose={closeAllPopups} />
          <ConfirmDeletePopup isOpen={isConfirmDeletePopupOpen} onClose={closeAllPopups} deleteCard={handleCardDelete} />
          <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} serverResponseStatus={serverResponseStatus} />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
