import React from 'react';
import logo from "../../assets/images/cabecera.png";
import './Header.css';

const Header: React.FC = () => {
  return (
    <header>
      <div className="logo">
        <a href="/inicio">
          <img src={logo} alt="Unyona Logo" className="unyona-logo" />
        </a>
      </div>
    </header>
  );
};

export default Header;