import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const titles = {
  '/dashboard': 'Overview', '/cards': 'My cards', '/transactions': 'Transactions',
  '/billing': 'Billing statements', '/repayments': 'Repayments', '/notifications': 'Notifications',
  '/reports': 'Reports & analytics', '/profile': 'My profile', '/admin': 'Admin overview',
  '/admin/users': 'Manage users', '/admin/cards': 'All cards', '/admin/contacts': 'Contact messages',
};

export default function AppShell() {
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const title = titles[location.pathname] || 'CreditWise';

  return (
    <div className="page-container">
      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <Sidebar onNavigate={() => setMenuOpen(false)} open={menuOpen} />
      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-leading">
            <button className="menu-toggle" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><i className="fas fa-bars" /></button>
            <div>
              <div className="topbar-eyebrow">{user?.role === 'admin' ? 'Administration' : 'CreditWise workspace'}</div>
              <h1 className="topbar-title">{title}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <Link to={user?.role === 'admin' ? '/admin/contacts' : '/notifications'} className="notif-bell" aria-label="Notifications">
              <i className="fas fa-bell" />
            </Link>
            <div className="topbar-greeting"><span className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</span><span>{user?.name}</span></div>
          </div>
        </header>
        <div className="content-area"><Outlet /></div>
      </main>
    </div>
  );
}
