const { validationResult } = require('express-validator');
const { sequelize } = require('../config/db');
const { Card, Transaction, BillingStatement, Repayment, Notification } = require('../models');
const { calculateUtilization, calculateAvailableCredit } = require('../utils/calculations');

// @desc   Get all cards for current user
// @route  GET /api/cards
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    const cardsWithStats = cards.map(card => {
      const utilization = calculateUtilization(card.currentOutstanding, card.creditLimit);
      const availableCredit = calculateAvailableCredit(card.creditLimit, card.currentOutstanding);
      return { ...card.toJSON(), utilization: parseFloat(utilization.toFixed(2)), availableCredit };
    });

    res.json({ success: true, count: cards.length, cards: cardsWithStats });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single card
// @route  GET /api/cards/:id
const getCard = async (req, res, next) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!card) return res.status(404).json({ success: false, message: 'Card not found.' });

    const utilization = calculateUtilization(card.currentOutstanding, card.creditLimit);
    const availableCredit = calculateAvailableCredit(card.creditLimit, card.currentOutstanding);
    res.json({ success: true, card: { ...card.toJSON(), utilization: parseFloat(utilization.toFixed(2)), availableCredit } });
  } catch (error) {
    next(error);
  }
};

// @desc   Add a card
// @route  POST /api/cards
const addCard = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { cardName, bankName, lastFourDigits, creditLimit, billingDate, dueDate, cardColor } = req.body;

    const card = await Card.create({
      userId: req.user.id,
      cardName,
      bankName,
      lastFourDigits,
      creditLimit,
      billingDate,
      dueDate,
      cardColor: cardColor || 'blue',
    });

    res.status(201).json({ success: true, message: 'Card added successfully!', card });
  } catch (error) {
    next(error);
  }
};

// @desc   Update card
// @route  PUT /api/cards/:id
const updateCard = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!card) return res.status(404).json({ success: false, message: 'Card not found.' });

    const { cardName, bankName, creditLimit, billingDate, dueDate, cardColor, status } = req.body;
    const updates = Object.fromEntries(Object.entries({ cardName, bankName, creditLimit, billingDate, dueDate, cardColor, status }).filter(([, value]) => value !== undefined));
    if (updates.creditLimit !== undefined && Number(updates.creditLimit) < Number(card.currentOutstanding)) {
      return res.status(400).json({ success: false, message: 'Credit limit cannot be lower than the current outstanding balance.' });
    }
    await card.update(updates);
    res.json({ success: true, message: 'Card updated successfully!', card });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete card
// @route  DELETE /api/cards/:id
const deleteCard = async (req, res, next) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const card = await Card.findOne({
        where: { id: req.params.id, userId: req.user.id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!card) {
        const notFound = new Error('Card not found.');
        notFound.statusCode = 404;
        throw notFound;
      }

      // Remove dependent records in FK order so the card can be deleted safely.
      await Repayment.destroy({ where: { cardId: card.id }, transaction });
      await BillingStatement.destroy({ where: { cardId: card.id }, transaction });
      await Transaction.destroy({ where: { cardId: card.id }, transaction });
      await Notification.update({ cardId: null }, { where: { cardId: card.id }, transaction });
      await card.destroy({ transaction });
    });

    res.json({ success: true, message: 'Card deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCards, getCard, addCard, updateCard, deleteCard };
