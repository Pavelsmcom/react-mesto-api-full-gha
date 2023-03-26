import { optionsConnection } from './constants.js';

class Api {
  constructor(optionsConnection) {
    this._baseUrl = optionsConnection.baseUrl;
    this._headers = optionsConnection.headers;
  }

  _isCorrectServerResponse(res, errorMessage) {
    if (!res.ok) {
      throw new Error(`${errorMessage}:\n ${res.status}`);
    }
  }

  // Получаем массив карточек от сервера
  async getInitialCards() {
    const res = await fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
    this._isCorrectServerResponse(res, 'Ошибка получения карточек с сервера');
    const data = await res.json();
    return data;
  }

  // Загружаем картчоку на сервер
  async addCard(card) {
    const res = await fetch(`${this._baseUrl}/cards `, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: card.name,
        link: card.link,
      }),
    });
    this._isCorrectServerResponse(res, 'Ошибка загрузки карточки на сервер');
    const data = await res.json();
    return data;
  }

  // Удаляем карточку
  async deleteCard(cardId) {
    const res = await fetch(`${this._baseUrl}/cards/${cardId} `, {
      method: 'DELETE',
      headers: this._headers,
    });
    this._isCorrectServerResponse(res, 'Ошибка удаления карточки');
  }

  // Ставим или удаляем лайк
  async changeLike(cardId, isLike) {
    const res = isLike
      ? await fetch(`${this._baseUrl}/cards/${cardId}/likes `, {
          method: 'DELETE',
          headers: this._headers,
        })
      : await fetch(`${this._baseUrl}/cards/${cardId}/likes `, {
          method: 'PUT',
          headers: this._headers,
        });
    this._isCorrectServerResponse(res, 'Ошибка изменения статуса лайка');
    const data = await res.json();
    return data;
  }

  // Получаем данные пользователя от сервера
  async getUserInfo() {
    const res = await fetch(`${this._baseUrl}/users/me `, {
      headers: this._headers,
    });
    this._isCorrectServerResponse(res, 'Ошибка получения данных пользователя с сервера');
    const data = await res.json();
    return data;
  }

  // Изменяем данные пользователя
  async setUserInfo(userInfo) {
    const res = await fetch(`${this._baseUrl}/users/me `, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: userInfo.name,
        about: userInfo.about,
      }),
    });
    this._isCorrectServerResponse(res, 'Ошибка изменения данных пользователя');
    const data = await res.json();
    return data;
  }

  // Изменяем аватар пользователя
  async setAvatar(link) {
    const res = await fetch(`${this._baseUrl}/users/me/avatar `, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link,
      }),
    });
    this._isCorrectServerResponse(res, 'Ошибка изменения аватара пользователя');
    const data = await res.json();
    return data;
  }
}

export const api = new Api(optionsConnection);
