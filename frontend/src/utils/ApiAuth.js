import { optionsConnectionAuth } from './constants.js';

class ApiAuth {
  constructor(optionsConnectionAuth) {
    this._baseUrl = optionsConnectionAuth.baseUrl;
    this._headers = optionsConnectionAuth.headers;
  }

  _isCorrectServerResponse(res, errorMessage) {
    if (!res.ok) {
      throw new Error(`${errorMessage}:\n ${res.status}`);
    }
  }

  // Регистрация пользователя
  async register({ password, email }) {
    const res = await fetch(`${this._baseUrl}signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ password: password, email: email }),
    });
    this._isCorrectServerResponse(res, 'Ошибка регистрации пользователя');
    const data = await res.json();
    return data;
  }

  // Авторизация  пользователя
  async login({ password, email }) {
    const res = await fetch(`${this._baseUrl}signin`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ password: password, email: email }),
    });
    this._isCorrectServerResponse(res, 'Ошибка авторизации пользователя');
    const data = await res.json();
    return data;
  }

  // Проверка токена
  async checkToken(token) {
    const res = await fetch(`${this._baseUrl}users/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    this._isCorrectServerResponse(res, 'Ошибка авторизации пользователя');
    const data = await res.json();
    return data;
  }
}

export const apiAuth = new ApiAuth(optionsConnectionAuth);
