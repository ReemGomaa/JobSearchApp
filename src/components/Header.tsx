import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

//allow children in the header component
interface HeaderProps {
  children?: React.ReactNode; 
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="header">
      <nav className="navbar">
        <div>JobsNow</div>
        <ul className="nav-links">
          <li><Link to="/jobs">Jobs</Link></li>
          <li><Link to="/jobs/search">Search</Link></li>
        </ul>
      </nav>
      {children}
    </header>
  );
};

export default Header;
