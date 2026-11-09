const express = require('express');
const { body } = require('express-validator');
const { getCards, getCard, addCard, updateCard, deleteCard } = require('../controllers/cardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getCards);
router.get('/:id', getCard);

router.post('/', [
  body('cardName').trim().notEmpty().withMessage('Card name is required'),
  body('bankName').trim().notEmpty().withMessage('Bank name is required'),
  body('lastFourDigits').isLength({ min: 4, max: 4 }).isNumeric().withMessage('Last 4 digits must be 4 numbers'),
  body('creditLimit').isFloat({ min: 1000 }).withMessage('Credit limit must be at least 1000'),
  body('billingDate').isInt({ min: 1, max: 31 }).withMessage('Billing date must be 1-31'),
  body('dueDate').isInt({ min: 1, max: 31 }).withMessage('Due date must be 1-31'),
], addCard);

router.put('/:id', [
  body('cardName').optional().trim().notEmpty().withMessage('Card name cannot be empty'),
  body('bankName').optional().trim().notEmpty().withMessage('Bank name cannot be empty'),
  body('creditLimit').optional().isFloat({ min: 1000 }).withMessage('Credit limit must be at least 1000'),
  body('billingDate').optional().isInt({ min: 1, max: 31 }).withMessage('Billing date must be 1-31'),
  body('dueDate').optional().isInt({ min: 1, max: 31 }).withMessage('Due date must be 1-31'),
  body('status').optional().isIn(['active', 'inactive', 'blocked']).withMessage('Invalid card status'),
], updateCard);
router.delete('/:id', deleteCard);

module.exports = router;
