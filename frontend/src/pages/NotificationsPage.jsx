import React, { useState } from 'react';
import api from '../services/api';
import {
  EmptyState,
  ErrorText,
  Loading,
  Notice,
  PageHeader,
  Panel,
  Status,
  dateLabel,
} from '../components/ui';
import { IconButton, useLoad } from './userPageHelpers';

export function NotificationsPage() {
  const {
    items: notifications,
    loading,
    error,
    load,
  } = useLoad('/notifications', 'notifications');

  const [actionError, setActionError] = useState(null);
  const [notice, setNotice] = useState('');

  async function markAsRead(notificationId) {
    try {
      await api.put(`/notifications/${notificationId}`);
      await load();
    } catch (requestError) {
      setActionError(requestError);
    }
  }

  async function deleteNotification(notificationId) {
    try {
      await api.delete(`/notifications/${notificationId}`);
      await load();
    } catch (requestError) {
      setActionError(requestError);
    }
  }

  async function markAllAsRead() {
    try {
      await api.put('/notifications/read-all');
      setNotice('All notifications marked as read.');
      await load();
    } catch (requestError) {
      setActionError(requestError);
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Due-date reminders and credit utilization alerts for your account."
        action={
          <button className="btn-secondary-cw" onClick={markAllAsRead}>
            <i className="fas fa-check-double" /> Mark all read
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
      ) : (
        <Panel title="All alerts" subtitle={`${unreadCount} unread`}>
          {notifications.length ? (
            notifications.map((notification) => (
              <article
                className={`notif-item ${notification.isRead ? '' : 'unread'}`}
                key={notification.id}
              >
                <span className={`notif-dot ${notification.isRead ? 'read' : ''}`} />
                <div className="notification-copy">
                  <div className="notification-meta">
                    <Status value={notification.type} />
                    <span>{dateLabel(notification.createdAt?.slice(0, 10))}</span>
                  </div>
                  <p>{notification.message}</p>
                  <small>
                    {notification.card?.bankName
                      ? `${notification.card.bankName} · ${notification.card.cardName}`
                      : 'CreditWise'}
                  </small>
                </div>
                <div className="row-actions">
                  {!notification.isRead && (
                    <IconButton
                      icon="fa-check"
                      label="Mark read"
                      onClick={() => markAsRead(notification.id)}
                    />
                  )}
                  <IconButton
                    icon="fa-trash"
                    label="Delete notification"
                    tone="danger"
                    onClick={() => deleteNotification(notification.id)}
                  />
                </div>
              </article>
            ))
          ) : (
            <EmptyState icon="fa-bell-slash" title="You're all caught up">
              Alerts will appear when a statement is approaching its due date
              or a card reaches an alert threshold.
            </EmptyState>
          )}
        </Panel>
      )}
    </div>
  );
}
