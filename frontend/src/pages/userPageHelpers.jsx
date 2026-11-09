import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { money } from '../components/ui';

// These options are shared by the forms for each feature.
export const CATEGORIES = [
  'Shopping', 'Groceries', 'Travel', 'Food & Dining', 'Entertainment',
  'Healthcare', 'Utilities', 'Fuel', 'Education', 'Other',
];

export const PAYMENT_MODES = [
  'UPI', 'Net Banking', 'Debit Card', 'NEFT', 'RTGS', 'Cash', 'Other',
];

export const CARD_COLORS = ['blue', 'purple', 'green', 'orange', 'red', 'teal'];

export function monthName(monthNumber) {
  const date = new Date(2000, Number(monthNumber) - 1, 1);
  return date.toLocaleString('en-IN', { month: 'long' });
}

// Load a list from the API and keep loading and error state in one place.
export function useLoad(path, responseKey) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(path);
      setItems(response.data[responseKey] || []);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [path]);

  return { items, setItems, loading, error, load };
}

export function IconButton({ icon, label, tone, ...props }) {
  return (
    <button
      className={`icon-button ${tone || ''}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <i className={`fas ${icon}`} />
    </button>
  );
}

export function FormActions({ onCancel, busy, label = 'Save changes' }) {
  return (
    <div className="form-actions">
      <button type="button" className="btn-secondary-cw" onClick={onCancel}>
        Cancel
      </button>
      <button className="btn-primary-cw" disabled={busy}>
        {busy ? 'Saving…' : label}
      </button>
    </div>
  );
}

// Show a simulated card and calculate its used credit percentage.
export function CardVisual({ card }) {
  const creditLimit = Number(card.creditLimit) || 0;
  const outstanding = Number(card.currentOutstanding) || 0;
  const utilization = card.utilization != null
    ? Number(card.utilization)
    : creditLimit > 0
      ? (outstanding / creditLimit) * 100
      : 0;
  const barWidth = Math.min(Math.max(utilization, 0), 100);
  const availableCredit = card.availableCredit ?? creditLimit - outstanding;

  return (
    <article className={`credit-card-widget ${card.cardColor || 'blue'} card-tile`}>
      <div className="card-visual-top">
        <div>
          <div className="card-bank">{card.bankName}</div>
          <strong>{card.cardName}</strong>
        </div>
        <i className="fas fa-credit-card" />
      </div>
      <div className="card-digits">•••• &nbsp;•••• &nbsp;•••• &nbsp;{card.lastFourDigits}</div>
      <div className="card-visual-bottom">
        <div>
          <small>CREDIT LIMIT</small>
          <strong>{money(card.creditLimit)}</strong>
        </div>
        <div className="align-right">
          <small>AVAILABLE</small>
          <strong>{money(availableCredit)}</strong>
        </div>
      </div>
      <div className="card-meter">
        <div>
          <span>Utilization</span>
          <b>{utilization.toFixed(0)}%</b>
        </div>
        <div className="utilization-bar">
          <div className="utilization-fill" style={{ width: `${barWidth}%` }} />
        </div>
      </div>
    </article>
  );
}
