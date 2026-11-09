import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  EmptyState,
  ErrorText,
  Loading,
  PageHeader,
  Panel,
  Stat,
  Status,
  TableWrap,
  dateLabel,
  money,
} from '../components/ui';
import { CardVisual } from './userPageHelpers';

export function Dashboard() {
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [statements, setStatements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The dashboard needs a small summary from four API areas.
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [cardResponse, transactionResponse, billingResponse, alertResponse] = await Promise.all([
          api.get('/cards'),
          api.get('/transactions?limit=6'),
          api.get('/billing'),
          api.get('/notifications'),
        ]);

        setCards(cardResponse.data.cards || []);
        setTransactions(transactionResponse.data.transactions || []);
        setStatements(billingResponse.data.statements || []);
        setNotifications(alertResponse.data.notifications || []);
      } catch (requestError) {
        setError(requestError);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totals = useMemo(() => {
    return cards.reduce(
      (summary, card) => {
        const limit = Number(card.creditLimit || 0);
        const outstanding = Number(card.currentOutstanding || 0);
        const available = Number(card.availableCredit ?? limit - outstanding);

        return {
          limit: summary.limit + limit,
          outstanding: summary.outstanding + outstanding,
          available: summary.available + available,
        };
      },
      { limit: 0, outstanding: 0, available: 0 },
    );
  }, [cards]);

  const upcomingStatements = statements
    .filter((statement) => ['unpaid', 'partially_paid', 'overdue'].includes(statement.status))
    .sort((first, second) => String(first.dueDate).localeCompare(String(second.dueDate)))
    .slice(0, 4);

  if (loading) {
    return <Loading />;
  }

  const utilization = totals.limit
    ? ((totals.outstanding / totals.limit) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="fade-in">
      <PageHeader
        title="Your credit, at a glance"
        description="A single view of your simulated cards, balances, and upcoming payments."
        action={
          <Link className="btn-primary-cw" to="/cards">
            <i className="fas fa-plus" /> Add a card
          </Link>
        }
      />
      <ErrorText error={error} />

      <div className="stats-grid">
        <Stat
          icon="fa-credit-card"
          label="Active cards"
          value={cards.filter((card) => card.status === 'active').length}
          tone="purple"
          detail={`${cards.length} total in your wallet`}
        />
        <Stat
          icon="fa-wallet"
          label="Total credit limit"
          value={money(totals.limit)}
          tone="blue"
          detail="Across all your cards"
        />
        <Stat
          icon="fa-arrow-trend-up"
          label="Outstanding balance"
          value={money(totals.outstanding)}
          tone="orange"
          detail={`${utilization}% overall utilization`}
        />
        <Stat
          icon="fa-circle-check"
          label="Available credit"
          value={money(totals.available)}
          tone="green"
          detail="Limit less current balances"
        />
      </div>

      <div className="dashboard-grid">
        <Panel
          title="Your cards"
          subtitle="Utilization and available credit"
          action={<Link className="text-link" to="/cards">View all <i className="fas fa-arrow-right" /></Link>}
          className="dashboard-cards-panel"
        >
          {cards.length ? (
            <div className="cards-grid">
              {cards.slice(0, 4).map((card) => (
                <CardVisual key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-credit-card"
              title="Start with a card"
              action={<Link to="/cards" className="btn-primary-cw">Add your first card</Link>}
            >
              Add a simulated card to start tracking your credit.
            </EmptyState>
          )}
        </Panel>

        <Panel
          title="Upcoming payments"
          subtitle="Statements that still need a payment"
          action={<Link className="text-link" to="/billing">All statements <i className="fas fa-arrow-right" /></Link>}
        >
          {upcomingStatements.length ? (
            <div className="compact-list">
              {upcomingStatements.map((statement) => (
                <div className="compact-row" key={statement.id}>
                  <div className="list-icon warn"><i className="fas fa-calendar-day" /></div>
                  <div className="compact-main">
                    <strong>{statement.card?.bankName} · {statement.card?.cardName}</strong>
                    <span>Due {dateLabel(statement.dueDate)}</span>
                  </div>
                  <div className="compact-value">
                    <strong>{money(statement.remainingAmount)}</strong>
                    <Status value={statement.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="fa-calendar-check" title="You're all caught up">
              Generate a statement after adding a card and recording transactions.
            </EmptyState>
          )}
        </Panel>

        <Panel
          title="Recent activity"
          subtitle="Latest simulated purchases"
          action={<Link className="text-link" to="/transactions">All activity <i className="fas fa-arrow-right" /></Link>}
        >
          {transactions.length ? (
            <TableWrap>
              <thead>
                <tr><th>Activity</th><th>Card</th><th>Date</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <strong>{transaction.description}</strong>
                      <small className="table-subtext">{transaction.category}</small>
                    </td>
                    <td>{transaction.card?.bankName || 'Card'}</td>
                    <td>{dateLabel(transaction.transactionDate)}</td>
                    <td className={transaction.type === 'refund' ? 'amount-credit' : ''}>
                      {transaction.type === 'refund' ? '+' : '−'}{money(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          ) : (
            <EmptyState icon="fa-arrow-right-arrow-left" title="No activity yet">
              Your transactions will appear here.
            </EmptyState>
          )}
        </Panel>

        <Panel
          title="Your alerts"
          subtitle="Reminders and utilization signals"
          action={<Link className="text-link" to="/notifications">See all <i className="fas fa-arrow-right" /></Link>}
        >
          {notifications.length ? (
            <div className="compact-list">
              {notifications.slice(0, 4).map((notification) => (
                <div className="compact-row" key={notification.id}>
                  <div className={`list-icon ${notification.isRead ? '' : 'unread'}`}>
                    <i className="fas fa-bell" />
                  </div>
                  <div className="compact-main">
                    <strong>{notification.card?.bankName || 'CreditWise alert'}</strong>
                    <span>{notification.message}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="fa-bell-slash" title="No alerts right now">
              Due-date and utilization alerts will show here.
            </EmptyState>
          )}
        </Panel>
      </div>
    </div>
  );
}
