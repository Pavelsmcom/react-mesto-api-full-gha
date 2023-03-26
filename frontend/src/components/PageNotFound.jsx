import React from 'react';

import picture from '../images/404.svg';

function PageNotFound() {
  return (
    <div className="not-found">
      <h3 className="not-found__title">404 - Страница не найдена</h3>
      <img className="not-found__picture" src={picture} alt="not found" />
    </div>
  );
}

export default PageNotFound;
