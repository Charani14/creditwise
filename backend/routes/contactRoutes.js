const express = require('express');
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');

const router = express.Router();

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], submitContact);

module.exports = router;
