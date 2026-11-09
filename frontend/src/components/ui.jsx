import React from 'react';

export const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
export const dateLabel = (value) => value ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const today = () => new Date().toLocaleDateString('en-CA');

export function PageHeader({ title, description, action, eyebrow }) {
  return <div className="page-header page-header-row"><div><div className="eyebrow">{eyebrow || 'CREDITWISE'}</div><h2 className="page-title">{title}</h2>{description && <p className="page-subtitle">{description}</p>}</div>{action}</div>;
}

export function Panel({ title, subtitle, action, children, className = '' }) {
  return <section className={`content-panel ${className}`}><div className="panel-heading">{(title || subtitle) && <div>{title && <h3 className="panel-title">{title}</h3>}{subtitle && <p className="panel-subtitle">{subtitle}</p>}</div>}{action}</div>{children}</section>;
}

export function Notice({ kind = 'info', children, onDismiss }) {
  if (!children) return null;
  return <div className={`alert-cw alert-${kind}`} role="status"><span>{children}</span>{onDismiss && <button className="notice-dismiss" onClick={onDismiss} aria-label="Dismiss">×</button>}</div>;
}

export function Loading({ label = 'Loading your workspace…' }) {
  return <div className="loading-state"><div className="spinner" /><span>{label}</span></div>;
}

export function EmptyState({ icon = 'fa-inbox', title, children, action }) {
  return <div className="empty-state"><i className={`fas ${icon}`} /><h4>{title}</h4>{children && <p>{children}</p>}{action}</div>;
}

export function Modal({ title, onClose, children, wide = false }) {
  return <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className={`modal-box ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close">×</button></div>{children}</div></div>;
}

export function Status({ value }) {
  const status = String(value || 'unknown').toLowerCase();
  const kind = ['active', 'paid', 'successful', 'completed', 'replied'].includes(status) ? 'success' : ['overdue', 'inactive', 'failed', 'blocked'].includes(status) ? 'danger' : ['unpaid', 'partially_paid', 'new', 'pending'].includes(status) ? 'warning' : 'secondary';
  return <span className={`badge-cw badge-${kind}`}>{status.replaceAll('_', ' ')}</span>;
}

export function Field({ label, error, hint, ...props }) {
  return <label className="field-wrap"><span className="form-label-cw">{label}</span><input className="form-control-cw" {...props} />{hint && <small className="field-hint">{hint}</small>}{error && <span className="form-error">{error}</span>}</label>;
}

export function SelectField({ label, children, ...props }) {
  return <label className="field-wrap"><span className="form-label-cw">{label}</span><select className="form-control-cw" {...props}>{children}</select></label>;
}

export function TableWrap({ children }) { return <div className="table-wrap"><table className="cw-table">{children}</table></div>; }

export function ErrorText({ error }) {
  if (!error) return null;
  const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Something went wrong. Please try again.';
  return <Notice kind="error">{message}</Notice>;
}

export function Stat({ icon, label, value, tone = 'purple', detail }) {
  return <div className="stat-card"><div className={`stat-card-icon ${tone}`}><i className={`fas ${icon}`} /></div><div className="stat-card-label">{label}</div><div className="stat-card-value">{value}</div>{detail && <div className="stat-detail">{detail}</div>}</div>;
}
