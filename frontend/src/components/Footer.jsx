import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '12px' }}>
            <span className="gradient-text">💳 CreditWise</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
            Your smart credit card & billing manager. Track utilization, manage statements, and never miss a payment.
          </p>
        </div>

        <div>
          <h6 style={{ fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Navigation</h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[['/', 'Home'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/login', 'Login'], ['/register', 'Register']].map(([to, label]) => (
              <Link key={to} to={to} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}
                onMouseOver={e => e.target.style.color = 'var(--primary-light)'}
                onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h6 style={{ fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Features</h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Credit Utilization Tracking', 'Billing Cycle Management', 'Repayment History', 'Smart Alerts', 'Analytics & Reports'].map(f => (
              <span key={f} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f}</span>
            ))}
          </div>
        </div>

        <div>
          <h6 style={{ fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tech Stack</h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['ReactJS + Vite', 'Node.js + Express', 'MySQL + Sequelize', 'JWT Authentication', 'Recharts Visualization'].map(t => (
              <span key={t} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 CreditWise. A CDAC Web Programming Technologies project built with React, Express, and MySQL.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
