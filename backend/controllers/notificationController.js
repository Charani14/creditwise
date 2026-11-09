const { Notification, Card, BillingStatement } = require('../models');
const { Op } = require('sequelize');
const { calculateUtilization, calculateDaysUntilDue } = require('../utils/calculations');

const createFreshAlert = async ({ userId, cardId, type, message, withinHours }) => {
  const recent = await Notification.findOne({
    where: {
      userId,
      cardId,
      type,
      createdAt: { [Op.gte]: new Date(Date.now() - withinHours * 60 * 60 * 1000) },
    },
  });
  if (!recent) await Notification.create({ userId, cardId, type, message });
};

// Refresh alerts when the dashboard/notification page loads so users do not
// have to wait for the scheduled daily sweep after adding new activity.
const refreshUserAlerts = async (userId) => {
  const cards = await Card.findAll({ where: { userId, status: 'active' } });
  for (const card of cards) {
    const utilization = calculateUtilization(card.currentOutstanding, card.creditLimit);
    if (utilization >= 95) {
      await createFreshAlert({ userId, cardId: card.id, type: 'high_utilization', withinHours: 24, message: `Critical: ${card.bankName} ${card.cardName} is at ${utilization.toFixed(1)}% credit utilization.` });
    } else if (utilization >= 85) {
      await createFreshAlert({ userId, cardId: card.id, type: 'high_utilization', withinHours: 24, message: `High utilization: ${card.bankName} ${card.cardName} is at ${utilization.toFixed(1)}%.` });
    } else if (utilization >= 70) {
      await createFreshAlert({ userId, cardId: card.id, type: 'high_utilization', withinHours: 24, message: `${card.bankName} ${card.cardName} is at ${utilization.toFixed(1)}% credit utilization.` });
    }
  }

  const statements = await BillingStatement.findAll({
    where: { userId, status: { [Op.in]: ['unpaid', 'partially_paid', 'overdue'] } },
    include: [{ model: Card, as: 'card', attributes: ['cardName', 'bankName'] }],
  });
  for (const statement of statements) {
    const daysLeft = calculateDaysUntilDue(statement.dueDate);
    if (daysLeft < 0 && statement.status !== 'overdue') await statement.update({ status: 'overdue' });
    const card = statement.card;
    const cardName = card ? `${card.bankName} ${card.cardName}` : 'Your card';
    if ([7, 3, 1, 0].includes(daysLeft)) {
      const timing = daysLeft === 0 ? 'today' : `in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
      await createFreshAlert({ userId, cardId: statement.cardId, type: 'due_date', withinHours: 20, message: `${cardName} statement payment of ₹${Number(statement.remainingAmount).toLocaleString('en-IN')} is due ${timing}.` });
    } else if (daysLeft < 0) {
      await createFreshAlert({ userId, cardId: statement.cardId, type: 'due_date', withinHours: 24, message: `${cardName} statement payment of ₹${Number(statement.remainingAmount).toLocaleString('en-IN')} is overdue.` });
    }
  }
};

// @desc   Get notifications for user
// @route  GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    await refreshUserAlerts(req.user.id);
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      include: [{ model: Card, as: 'card', attributes: ['id', 'cardName', 'bankName'] }],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;
    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc   Mark notification as read
// @route  PUT /api/notifications/:id
const markRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found.' });
    await notif.update({ isRead: true });
    res.json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    next(error);
  }
};

// @desc   Mark all notifications as read
// @route  PUT /api/notifications/read-all
const markAllRead = async (req, res, next) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete notification
// @route  DELETE /api/notifications/:id
const deleteNotification = async (req, res, next) => {
  try {
    const notif = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found.' });
    await notif.destroy();
    res.json({ success: true, message: 'Notification deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markRead, markAllRead, deleteNotification, refreshUserAlerts };
