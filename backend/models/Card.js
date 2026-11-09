const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Card = sequelize.define('Card', {
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
  cardName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  lastFourDigits: {
    type: DataTypes.STRING(4),
    allowNull: false,
    validate: { len: [4, 4], isNumeric: true },
  },
  creditLimit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 1000 },
  },
  currentOutstanding: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00,
  },
  billingDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 31 },
    comment: 'Day of month when billing cycle closes',
  },
  dueDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 31 },
    comment: 'Day of month when payment is due',
  },
  cardColor: {
    type: DataTypes.STRING(20),
    defaultValue: 'blue',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'blocked'),
    defaultValue: 'active',
  },
}, {
  tableName: 'cards',
  timestamps: true,
});

module.exports = Card;
