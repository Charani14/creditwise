const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters.'),
  body('phone').optional().isString().isLength({ max: 20 }).withMessage('Phone must be 20 characters or fewer.'),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
], updateProfile);

module.exports = router;
