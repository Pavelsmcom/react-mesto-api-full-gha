import { React, useContext } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Grid } from 'react-loader-spinner';

function Main({ onCardClick, onCardLike, onCardDelete, onEditAvatar, onEditProfile, onAddPlace, isCardLoading, cards }) {
  const currentUser = useContext(CurrentUserContext);

  const cardsElements = cards.map((card) => {
    const isOwn = card.owner === currentUser._id;
    const isLiked = card.likes.some((i) => i === currentUser._id);
    return (
      <li className="cards__item" key={card._id}>
        <Card card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} isOwn={isOwn} isLiked={isLiked} />
      </li>
    );
  });

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__container">
          <div className="profile__avatar-container" onClick={onEditAvatar}>
            <img className="profile__avatar" src={currentUser?.avatar} alt="Аватар" />
          </div>
          <h1 className="profile__name">{currentUser?.name}</h1>
          <button className="profile__edit-btn" type="button" aria-label="Кнопка редактирования профиля" onClick={onEditProfile} />
          <p className="profile__description">{currentUser?.about}</p>
        </div>
        <button className="profile__add-btn" type="button" aria-label="Кнопка добавления места" onClick={onAddPlace} />
      </section>
      <section className="elements" aria-label="Секция с фото-карточками">
        <ul className="cards">
          {isCardLoading ? (
            <div className="cards__loader">
              <Grid height="80" width="80" color="#e0e0e0" ariaLabel="grid-loading" radius="12.5" wrapperStyle={{}} wrapperClass="" visible={true} />
            </div>
          ) : (
            cardsElements
          )}
        </ul>
      </section>
    </main>
  );
}

export default Main;
