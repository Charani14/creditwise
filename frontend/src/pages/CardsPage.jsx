import React, { useState } from 'react';
import api from '../services/api';
import {
  EmptyState,
  ErrorText,
  Field,
  Loading,
  Modal,
  Notice,
  PageHeader,
  Panel,
  SelectField,
  Status,
} from '../components/ui';
import { CARD_COLORS, CardVisual, FormActions, IconButton, useLoad } from './userPageHelpers';

const blankCard = {
  cardName: '',
  bankName: '',
  lastFourDigits: '',
  creditLimit: '',
  billingDate: '15',
  dueDate: '5',
  cardColor: 'blue',
};

export function CardsPage() {
  const { items: cards, loading, error, load } = useLoad('/cards', 'cards');
  const [editingCard, setEditingCard] = useState(null);
  const [form, setForm] = useState(blankCard);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState(null);

  function openForm(card) {
    setActionError(null);
    setEditingCard(card || {});
    setForm(card ? { ...card } : { ...blankCard });
  }

  function updateField(fieldName) {
    return (event) => {
      setForm({ ...form, [fieldName]: event.target.value });
    };
  }

  async function saveCard(event) {
    event.preventDefault();
    setBusy(true);
    setActionError(null);

    try {
      if (editingCard?.id) {
        await api.put(`/cards/${editingCard.id}`, form);
        setNotice('Card details updated.');
      } else {
        await api.post('/cards', form);
        setNotice('Card added to your wallet.');
      }

      setEditingCard(null);
      await load();
    } catch (requestError) {
      setActionError(requestError);
    } finally {
      setBusy(false);
    }
  }

  async function deleteCard(card) {
    const warning = `Permanently delete ${card.cardName} and its transactions, statements, and repayments? This cannot be undone.`;
    if (!window.confirm(warning)) {
      return;
    }

    setActionError(null);

    try {
      await api.delete(`/cards/${card.id}`);
      setNotice('Card and its financial history deleted.');
      await load();
    } catch (requestError) {
      setActionError(requestError);
    }
  }

  return (
    <div>
      <PageHeader
        title="My cards"
        description="Manage simulated cards and monitor each card’s available credit."
        action={
          <button className="btn-primary-cw" onClick={() => openForm(null)}>
            <i className="fas fa-plus" /> Add card
          </button>
        }
      />

      {notice && (
        <Notice kind="success" onDismiss={() => setNotice('')}>
          {notice}
        </Notice>
      )}
      <ErrorText error={actionError || error} />

      {loading ? (
        <Loading />
      ) : cards.length ? (
        <div className="cards-grid">
          {cards.map((card) => (
            <div className="managed-card" key={card.id}>
              <CardVisual card={card} />
              <div className="managed-card-footer">
                <div>
                  <Status value={card.status} />
                  <span className="due-hint">
                    Billing day {card.billingDate} · Due day {card.dueDate}
                  </span>
                </div>
                <div className="row-actions">
                  <IconButton
                    icon="fa-pen"
                    label="Edit card"
                    onClick={() => openForm(card)}
                  />
                  <IconButton
                    icon="fa-trash"
                    label="Delete card"
                    tone="danger"
                    onClick={() => deleteCard(card)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Panel>
          <EmptyState
            icon="fa-credit-card"
            title="No cards added yet"
            action={
              <button className="btn-primary-cw" onClick={() => openForm(null)}>
                Add a card
              </button>
            }
          >
            Add a simulated card to begin tracking its spending and billing cycle.
          </EmptyState>
        </Panel>
      )}

      {editingCard && (
        <Modal
          title={editingCard.id ? 'Edit card' : 'Add a simulated card'}
          onClose={() => setEditingCard(null)}
        >
          <form onSubmit={saveCard}>
            <div className="form-row">
              <Field
                label="Card name"
                value={form.cardName}
                onChange={updateField('cardName')}
                required
                maxLength="100"
                placeholder="Millennia"
              />
              <Field
                label="Bank"
                value={form.bankName}
                onChange={updateField('bankName')}
                required
                maxLength="100"
                placeholder="HDFC Bank"
              />
            </div>

            {!editingCard.id && (
              <Field
                label="Last four digits"
                value={form.lastFourDigits}
                onChange={updateField('lastFourDigits')}
                required
                minLength="4"
                maxLength="4"
                pattern="[0-9]{4}"
                inputMode="numeric"
                hint="Use a made-up identifier. Never enter actual card details."
                placeholder="4521"
              />
            )}

            <Field
              label="Credit limit (₹)"
              type="number"
              min="1000"
              step="0.01"
              value={form.creditLimit}
              onChange={updateField('creditLimit')}
              required
            />

            <div className="form-row">
              <Field
                label="Billing day"
                type="number"
                min="1"
                max="31"
                value={form.billingDate}
                onChange={updateField('billingDate')}
                required
              />
              <Field
                label="Payment due day"
                type="number"
                min="1"
                max="31"
                value={form.dueDate}
                onChange={updateField('dueDate')}
                required
              />
            </div>

            <SelectField
              label="Card color"
              value={form.cardColor}
              onChange={updateField('cardColor')}
            >
              {CARD_COLORS.map((color) => (
                <option key={color}>{color}</option>
              ))}
            </SelectField>

            {editingCard.id && (
              <SelectField
                label="Status"
                value={form.status}
                onChange={updateField('status')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </SelectField>
            )}

            <ErrorText error={actionError} />
            <FormActions
              onCancel={() => setEditingCard(null)}
              busy={busy}
              label={editingCard.id ? 'Save card' : 'Add card'}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}
