const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'cards', key: 'id' },
  },
  message: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('due_date', 'high_utilization', 'payment_success', 'statement_generated', 'general'),
    defaultValue: 'general',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;
