const cron = require('node-cron');
const { Card, BillingStatement, Notification } = require('../models');
const { calculateUtilization, calculateDaysUntilDue } = require('../utils/calculations');
const { Op } = require('sequelize');

const runAlertJob = async () => {
  try {
    console.log('🔔 Running alert job...');

    // 1. Check high credit utilization
    const cards = await Card.findAll({ where: { status: 'active' } });

    for (const card of cards) {
      const utilization = calculateUtilization(card.currentOutstanding, card.creditLimit);

      let alertMessage = null;
      let alertType = 'high_utilization';

      if (utilization >= 95) {
        alertMessage = `🚨 CRITICAL: Your ${card.bankName} card (${card.cardName}) utilization is ${utilization.toFixed(1)}% — almost at limit!`;
      } else if (utilization >= 85) {
        alertMessage = `⚠️ HIGH: Your ${card.bankName} card (${card.cardName}) utilization is ${utilization.toFixed(1)}%. Consider paying down the balance.`;
      } else if (utilization >= 70) {
        alertMessage = `📊 MODERATE: Your ${card.bankName} card (${card.cardName}) utilization is ${utilization.toFixed(1)}%.`;
      }

      if (alertMessage) {
        // Avoid duplicate notifications (check if similar notif exists in last 24h)
        const recent = await Notification.findOne({
          where: {
            userId: card.userId,
            cardId: card.id,
            type: alertType,
            createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        });

        if (!recent) {
          await Notification.create({
            userId: card.userId,
            cardId: card.id,
            message: alertMessage,
            type: alertType,
          });
        }
      }
    }

    // 2. Check upcoming due dates
    const statements = await BillingStatement.findAll({
      where: { status: { [Op.in]: ['unpaid', 'partially_paid'] } },
      include: [{ model: Card, as: 'card', attributes: ['cardName', 'bankName'] }],
    });

    for (const stmt of statements) {
      const daysLeft = calculateDaysUntilDue(stmt.dueDate);

      let dueMsgArr = [];
      if (daysLeft === 7) dueMsgArr = ['📅 REMINDER', '7 days'];
      else if (daysLeft === 3) dueMsgArr = ['⚠️ URGENT', '3 days'];
      else if (daysLeft === 1) dueMsgArr = ['🚨 DUE TOMORROW', '1 day'];
      else if (daysLeft === 0) dueMsgArr = ['🔴 DUE TODAY', 'TODAY'];

      if (dueMsgArr.length) {
        const message = `${dueMsgArr[0]}: Your ${stmt.card?.bankName} card payment of ₹${parseFloat(stmt.remainingAmount).toLocaleString('en-IN')} is due in ${dueMsgArr[1]}!`;

        const recent = await Notification.findOne({
          where: {
            userId: stmt.userId,
            cardId: stmt.cardId,
            type: 'due_date',
            createdAt: { [Op.gte]: new Date(Date.now() - 20 * 60 * 60 * 1000) },
          },
        });

        if (!recent) {
          await Notification.create({
            userId: stmt.userId,
            cardId: stmt.cardId,
            message,
            type: 'due_date',
          });
        }
      }
    }

    console.log('✅ Alert job completed.');
  } catch (error) {
    console.error('❌ Alert job error:', error.message);
  }
};

// Schedule: Run daily at midnight
const startAlertJob = () => {
  cron.schedule('0 0 * * *', runAlertJob, {
    timezone: 'Asia/Kolkata',
  });
  console.log('📅 Alert cron job scheduled (daily at midnight IST)');
};

module.exports = { startAlertJob, runAlertJob };
