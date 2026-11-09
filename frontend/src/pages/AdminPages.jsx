import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  EmptyState,
  ErrorText,
  Loading,
  Modal,
  Notice,
  PageHeader,
  Panel,
  Stat,
  Status,
  TableWrap,
  dateLabel,
  money,
} from '../components/ui';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const [statsResponse, usersResponse, cardsResponse] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/cards'),
        ]);

        setStats(statsResponse.data.stats);
        setUsers(usersResponse.data.users || []);
        setCards(cardsResponse.data.cards || []);
      } catch (requestError) {
        setError(requestError);
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  if (loading) {
    return <Loading label="Loading admin overview…" />;
  }

  const highUseCards = cards.filter((card) => {
    const limit = Number(card.creditLimit);
    return limit > 0 && Number(card.currentOutstanding) / limit >= 0.7;
  }).length;

  return (
    <div>
      <PageHeader
        title="Application overview"
        description="Monitor CreditWise users, simulated activity, and contact messages."
      />
      <ErrorText error={error} />

      {stats && (
        <>
          <div className="stats-grid">
            <Stat
              icon="fa-users"
              label="Registered users"
              value={stats.totalUsers}
              detail={`${stats.activeUsers} active`}
              tone="purple"
            />
            <Stat
              icon="fa-credit-card"
              label="Simulated cards"
              value={stats.totalCards}
              detail={`${highUseCards} at 70%+ utilization`}
              tone="blue"
            />
            <Stat
              icon="fa-arrow-right-arrow-left"
              label="Transactions"
              value={stats.totalTransactions}
              detail="Across all user accounts"
              tone="green"
            />
            <Stat
              icon="fa-envelope"
              label="New messages"
              value={stats.newMessages}
              detail="Contact form submissions"
              tone="orange"
            />
          </div>

          <div className="two-col-grid">
            <Panel title="Platform balances" subtitle="Simulated card limits and outstanding balances">
              <div className="admin-balance-grid">
                <div>
                  <span>Total limits</span>
                  <strong>{money(stats.totalLimit)}</strong>
                </div>
                <div>
                  <span>Total outstanding</span>
                  <strong>{money(stats.totalOutstanding)}</strong>
                </div>
                <div>
                  <span>Overall utilization</span>
                  <strong>
                    {Number(stats.totalLimit)
                      ? `${(Number(stats.totalOutstanding) / Number(stats.totalLimit) * 100).toFixed(1)}%`
                      : '0%'}
                  </strong>
                </div>
              </div>
            </Panel>

            <Panel title="Quick links" subtitle="Common administration tasks">
              <div className="quick-links">
                <Link to="/admin/users">
                  <i className="fas fa-users" /> Manage accounts
                  <i className="fas fa-arrow-right" />
                </Link>
                <Link to="/admin/cards">
                  <i className="fas fa-credit-card" /> Browse all cards
                  <i className="fas fa-arrow-right" />
                </Link>
                <Link to="/admin/contacts">
                  <i className="fas fa-envelope" /> Review contact messages
                  <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </Panel>
          </div>

          <Panel title="Latest registered users" subtitle="Most recent accounts">
            <TableWrap>
              <thead>
                <tr><th>User</th><th>Email</th><th>Joined</th><th>Status</th></tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>{dateLabel(user.createdAt?.slice(0, 10))}</td>
                    <td><Status value={user.status} /></td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </>
      )}
    </div>
  );
}

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleUserStatus(user) {
    setBusyId(user.id);
    setError(null);

    try {
      const response = await api.put(`/admin/users/${user.id}/status`);
      const updatedUser = response.data.user;

      setUsers((currentUsers) => currentUsers.map((currentUser) => (
        currentUser.id === user.id ? updatedUser : currentUser
      )));
      setNotice(`${user.name} is now ${updatedUser.status}.`);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setBusyId(null);
    }
  }

  const visibleUsers = users.filter((user) => {
    const searchableText = `${user.name} ${user.email}`.toLowerCase();
    return searchableText.includes(query.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        title="Manage users"
        description="Review registered accounts and control access status."
      />
      <ErrorText error={error} />
      {notice && (
        <Notice kind="success" onDismiss={() => setNotice('')}>
          {notice}
        </Notice>
      )}

      <Panel title="User accounts" subtitle={`${users.length} accounts`}>
        <div className="toolbar">
          <label className="search-box">
            <i className="fas fa-search" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or email"
            />
          </label>
          <button
            className="btn-secondary-cw compact-button"
            onClick={loadUsers}
          >
            <i className="fas fa-rotate" /> Refresh
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : visibleUsers.length ? (
          <TableWrap>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Access</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td><Status value={user.role} /></td>
                  <td>{dateLabel(user.createdAt?.slice(0, 10))}</td>
                  <td><Status value={user.status} /></td>
                  <td>
                    {user.role === 'admin' ? (
                      <span className="table-subtext">Admin account</span>
                    ) : (
                      <button
                        className={`compact-button ${user.status === 'active' ? 'btn-danger-cw' : 'btn-primary-cw'}`}
                        onClick={() => toggleUserStatus(user)}
                        disabled={busyId === user.id}
                      >
                        {busyId === user.id
                          ? 'Saving…'
                          : user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState icon="fa-user-slash" title="No matching accounts">
            Try another search term.
          </EmptyState>
        )}
      </Panel>
    </div>
  );
}

export function AdminCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/admin/cards')
      .then((response) => setCards(response.data.cards || []))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const visibleCards = cards.filter((card) => {
    const ownerName = card.user?.name || '';
    const ownerEmail = card.user?.email || '';
    const searchableText = `${card.cardName} ${card.bankName} ${ownerName} ${ownerEmail}`;
    return searchableText.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        title="All simulated cards"
        description="View card ownership and high-level usage across the application."
      />
      <ErrorText error={error} />

      <Panel title="Card directory" subtitle={`${cards.length} cards on the platform`}>
        <div className="toolbar">
          <label className="search-box">
            <i className="fas fa-search" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cards or owners"
            />
          </label>
        </div>

        {loading ? (
          <Loading />
        ) : visibleCards.length ? (
          <TableWrap>
            <thead>
              <tr>
                <th>Card</th><th>Owner</th><th>Limit</th><th>Outstanding</th><th>Utilization</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleCards.map((card) => {
                const creditLimit = Number(card.creditLimit);
                const outstanding = Number(card.currentOutstanding);
                const utilization = creditLimit ? (outstanding / creditLimit) * 100 : 0;

                return (
                  <tr key={card.id}>
                    <td>
                      <strong>{card.bankName}</strong>
                      <small className="table-subtext">
                        {card.cardName} · ••{card.lastFourDigits}
                      </small>
                    </td>
                    <td>
                      {card.user?.name}
                      <small className="table-subtext">{card.user?.email}</small>
                    </td>
                    <td>{money(card.creditLimit)}</td>
                    <td>{money(card.currentOutstanding)}</td>
                    <td>
                      <div className="table-util">
                        <div className="utilization-bar">
                          <div
                            className="utilization-fill"
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                        <small>{utilization.toFixed(1)}%</small>
                      </div>
                    </td>
                    <td><Status value={card.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState icon="fa-credit-card" title="No matching cards">
            Try another search term.
          </EmptyState>
        )}
      </Panel>
    </div>
  );
}

const STATUS_OPTIONS = ['new', 'read', 'replied', 'closed'];

function createReplyLink(message) {
  const subject = `Re: ${message.subject}`;
  const body = `Hello ${message.name},\n\n\n\nRegards,\nCreditWise Support`;
  return `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  async function loadMessages() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/admin/contacts');
      setMessages(response.data.messages || []);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function updateMessageStatus(messageId, status) {
    setError(null);

    try {
      const response = await api.put(`/admin/contacts/${messageId}`, { status });
      setMessages((currentMessages) => currentMessages.map((message) => (
        message.id === messageId ? response.data.msg : message
      )));
      setNotice('Message status updated.');
    } catch (requestError) {
      setError(requestError);
    }
  }

  async function deleteMessage(messageId) {
    if (!window.confirm('Delete this contact message?')) {
      return;
    }

    try {
      await api.delete(`/admin/contacts/${messageId}`);
      setMessages((currentMessages) => currentMessages.filter(
        (message) => message.id !== messageId,
      ));
      setNotice('Message deleted.');
    } catch (requestError) {
      setError(requestError);
    }
  }

  return (
    <div>
      <PageHeader
        title="Contact messages"
        description="Read each full message, reply in your email app, and update its status here."
        action={
          <button className="btn-secondary-cw" onClick={loadMessages}>
            <i className="fas fa-rotate" /> Refresh
          </button>
        }
      />
      {notice && (
        <Notice kind="success" onDismiss={() => setNotice('')}>
          {notice}
        </Notice>
      )}
      <ErrorText error={error} />

      {loading ? (
        <Loading />
      ) : messages.length ? (
        <div className="message-list">
          {messages.map((message) => (
            <article className="content-panel message-card" key={message.id}>
              <div className="message-card-head">
                <div>
                  <div className="eyebrow">{dateLabel(message.createdAt?.slice(0, 10))}</div>
                  <h3>{message.subject}</h3>
                  <div className="message-sender">
                    {message.name} · <a href={`mailto:${message.email}`}>{message.email}</a>
                  </div>
                </div>
                <Status value={message.status} />
              </div>
              <p>{message.message}</p>
              <div className="message-controls">
                <button
                  className="btn-secondary-cw compact-button"
                  onClick={() => setSelectedMessage(message)}
                >
                  <i className="fas fa-expand" /> View full message
                </button>
                <label className="status-select">
                  <span>Update status</span>
                  <select
                    value={message.status}
                    onChange={(event) => updateMessageStatus(message.id, event.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <a
                  className="btn-primary-cw compact-button"
                  href={createReplyLink(message)}
                >
                  <i className="fas fa-reply" /> Reply by email
                </a>
                <button
                  className="btn-danger-cw compact-button"
                  onClick={() => deleteMessage(message.id)}
                >
                  <i className="fas fa-trash" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Panel>
          <EmptyState icon="fa-envelope-open" title="No messages yet">
            New contact form submissions will appear here.
          </EmptyState>
        </Panel>
      )}

      {selectedMessage && (
        <Modal
          title={selectedMessage.subject}
          onClose={() => setSelectedMessage(null)}
          wide
        >
          <div className="message-detail-meta">
            <strong>{selectedMessage.name}</strong>
            <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
            <span>{dateLabel(selectedMessage.createdAt?.slice(0, 10))}</span>
          </div>
          <div className="message-full-text">{selectedMessage.message}</div>
          <div className="form-actions">
            <button
              className="btn-secondary-cw"
              onClick={() => setSelectedMessage(null)}
            >
              Close
            </button>
            <a
              className="btn-primary-cw"
              href={createReplyLink(selectedMessage)}
            >
              <i className="fas fa-reply" /> Reply by email
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}
