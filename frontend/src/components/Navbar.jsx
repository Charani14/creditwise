import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`public-nav ${menuOpen ? 'public-nav-open' : ''}`}>
      <Link to="/" className="nav-logo">💳 CreditWise</Link>

      <button className="nav-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} /></button>

      <div className="nav-links">
        <Link to="/" onClick={() => setMenuOpen(false)} className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)} className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)} className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>

        {isAuthenticated ? (
          <>
            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)} className="btn-secondary-cw" style={{ marginLeft: '8px' }}>
              <i className="fas fa-chart-pie"></i> Dashboard
            </Link>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="btn-danger-cw" style={{ marginLeft: '8px' }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary-cw" style={{ marginLeft: '8px' }}>Log In</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary-cw" style={{ marginLeft: '8px' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
