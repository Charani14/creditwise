const User = require('./User');
const Card = require('./Card');
const Transaction = require('./Transaction');
const BillingStatement = require('./BillingStatement');
const Repayment = require('./Repayment');
const Notification = require('./Notification');
const ContactMessage = require('./ContactMessage');

// User → Cards (one-to-many)
User.hasMany(Card, { foreignKey: 'userId', as: 'cards', onDelete: 'CASCADE' });
Card.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Card → Transactions (one-to-many)
Card.hasMany(Transaction, { foreignKey: 'cardId', as: 'transactions', onDelete: 'CASCADE' });
Transaction.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Card → BillingStatements (one-to-many)
Card.hasMany(BillingStatement, { foreignKey: 'cardId', as: 'statements', onDelete: 'CASCADE' });
BillingStatement.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });
User.hasMany(BillingStatement, { foreignKey: 'userId', as: 'statements' });
BillingStatement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// BillingStatement → Repayments (one-to-many)
BillingStatement.hasMany(Repayment, { foreignKey: 'statementId', as: 'repayments', onDelete: 'RESTRICT' });
Repayment.belongsTo(BillingStatement, { foreignKey: 'statementId', as: 'statement' });
Card.hasMany(Repayment, { foreignKey: 'cardId', as: 'repayments' });
Repayment.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });
User.hasMany(Repayment, { foreignKey: 'userId', as: 'repayments' });
Repayment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User → Notifications (one-to-many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Card.hasMany(Notification, { foreignKey: 'cardId', as: 'notifications', onDelete: 'SET NULL' });
Notification.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });

module.exports = {
  User,
  Card,
  Transaction,
  BillingStatement,
  Repayment,
  Notification,
  ContactMessage,
};
