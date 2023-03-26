import React from 'react';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__copyright" lang="en">
        © {year} Mesto Russia
      </p>
    </footer>
  );
}

export default Footer;
