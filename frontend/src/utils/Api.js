class Api {
  constructor(optionsConnection) {
    this._baseUrl = optionsConnection.baseUrl;
  }

  _isCorrectServerResponse(res, errorMessage) {
    if (!res.ok) {
      throw new Error(`${errorMessage}:\n ${res.status}`);
    }
  }

  _getAuthHeader() {
    return `Bearer ${localStorage.getItem('jwt')}`;
  }

  // Получаем массив карточек от сервера
  async getInitialCards() {
    const res = await fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: this._getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    this._isCorrectServerResponse(res, 'Ошибка получения карточек с сервера');
    const data = await res.json();
    return data;
  }

  // Загружаем картчоку на сервер
  async addCard(card) {
    const res = await fetch(`${this._baseUrl}/cards `, {
      method: 'POST',
      headers: {
        authorization: this._getAuthHeader(),
        'Content-Type': 'application/json',
      },
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
      headers: {
        authorization: this._getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    this._isCorrectServerResponse(res, 'Ошибка удаления карточки');
  }

  // Ставим или удаляем лайк
  async changeLike(cardId, isLike) {
    const res = isLike
      ? await fetch(`${this._baseUrl}/cards/${cardId}/likes `, {
          method: 'DELETE',
          headers: {
            authorization: this._getAuthHeader(),
            'Content-Type': 'application/json',
          },
        })
      : await fetch(`${this._baseUrl}/cards/${cardId}/likes `, {
          method: 'PUT',
          headers: {
            authorization: this._getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });
    this._isCorrectServerResponse(res, 'Ошибка изменения статуса лайка');
    const data = await res.json();
    return data;
  }

  // Получаем данные пользователя от сервера
  async getUserInfo() {
    const res = await fetch(`${this._baseUrl}/users/me `, {
      headers: {
        authorization: this._getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    this._isCorrectServerResponse(res, 'Ошибка получения данных пользователя с сервера');
    const data = await res.json();
    return data;
  }

  // Изменяем данные пользователя
  async setUserInfo(userInfo) {
    const res = await fetch(`${this._baseUrl}/users/me `, {
      method: 'PATCH',
      headers: {
        authorization: this._getAuthHeader(),
        'Content-Type': 'application/json',
      },
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
      headers: {
        authorization: this._getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: link,
      }),
    });
    this._isCorrectServerResponse(res, 'Ошибка изменения аватара пользователя');
    const data = await res.json();
    return data;
  }
}

export const api = new Api({
  baseUrl: 'https://api.mesto.pavelsm.nomoredomains.work',
});
