import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const userMenuItems = [
  { to: '/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
  { to: '/cards', icon: 'fa-credit-card', label: 'My Cards' },
  { to: '/transactions', icon: 'fa-arrow-right-arrow-left', label: 'Transactions' },
  { to: '/billing', icon: 'fa-file-invoice-dollar', label: 'Billing Statements' },
  { to: '/repayments', icon: 'fa-money-bill-wave', label: 'Repayments' },
  { to: '/notifications', icon: 'fa-bell', label: 'Notifications' },
  { to: '/reports', icon: 'fa-chart-bar', label: 'Reports & Analytics' },
  { to: '/profile', icon: 'fa-user-circle', label: 'My Profile' },
];

const adminMenuItems = [
  { to: '/admin', icon: 'fa-gauge-high', label: 'Admin Dashboard' },
  { to: '/admin/users', icon: 'fa-users', label: 'Manage Users' },
  { to: '/admin/cards', icon: 'fa-credit-card', label: 'All Cards' },
  { to: '/admin/contacts', icon: 'fa-envelope', label: 'Contact Messages' },
];

const Sidebar = ({ onNavigate, open = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo-text">💳 CreditWise</div>
        </Link>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Smart Credit Manager
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">
          {user?.role === 'admin' ? 'Administration' : 'Navigation'}
        </div>

        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <i className={`fas ${item.icon}`}></i>
            {item.label}
          </Link>
        ))}

        <div style={{ margin: '16px 12px 8px', borderTop: '1px solid var(--border)' }}></div>

        <button className="sidebar-link" onClick={() => { onNavigate?.(); handleLogout(); }} style={{ color: '#fca5a5' }}>
          <i className="fas fa-right-from-bracket"></i>
          Sign Out
        </button>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', truncate: true, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
