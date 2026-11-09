const { sequelize } = require('../config/db');
const { Transaction, Card } = require('../models');
const { calculateUtilization } = require('../utils/calculations');

// @desc   Monthly spending report
// @route  GET /api/reports/monthly
const getMonthlySpending = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const [rows] = await sequelize.query(`
      SELECT 
        MONTH(transactionDate) as month,
        MONTHNAME(transactionDate) as monthName,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE userId = :userId AND YEAR(transactionDate) = :year AND type = 'purchase' AND status = 'completed'
      GROUP BY MONTH(transactionDate), MONTHNAME(transactionDate)
      ORDER BY MONTH(transactionDate)
    `, { replacements: { userId: req.user.id, year } });

    // Fill missing months with 0
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data = monthNames.map((name, i) => {
      const found = rows.find(r => r.month === i + 1);
      return { month: name, total: found ? parseFloat(found.total) : 0, count: found ? found.count : 0 };
    });

    res.json({ success: true, year, data });
  } catch (error) {
    next(error);
  }
};

// @desc   Card-wise utilization and spending
// @route  GET /api/reports/utilization
const getUtilizationReport = async (req, res, next) => {
  try {
    const cards = await Card.findAll({ where: { userId: req.user.id, status: 'active' } });

    const data = cards.map(card => ({
      cardName: card.cardName,
      bankName: card.bankName,
      creditLimit: parseFloat(card.creditLimit),
      outstanding: parseFloat(card.currentOutstanding),
      utilization: parseFloat(calculateUtilization(card.currentOutstanding, card.creditLimit).toFixed(2)),
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc   Category-wise spending
// @route  GET /api/reports/categories
const getCategorySpending = async (req, res, next) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT category, SUM(amount) as total, COUNT(*) as count
      FROM transactions
      WHERE userId = :userId AND type = 'purchase' AND status = 'completed'
      GROUP BY category
      ORDER BY total DESC
    `, { replacements: { userId: req.user.id } });

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMonthlySpending, getUtilizationReport, getCategorySpending };
