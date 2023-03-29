export const optionsConnection = {
  baseUrl: 'http://api.mesto.pavelsm.nomoredomains.work',
  headers: {
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  },
};

export const optionsConnectionAuth = {
  baseUrl: 'http://api.mesto.pavelsm.nomoredomains.work',
  headers: {
    'Content-Type': 'application/json',
  },
};
