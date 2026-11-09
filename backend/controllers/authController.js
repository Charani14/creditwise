const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured.');
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

const setCookieToken = (res, token) => {
  const options = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.cookie('token', token, options);
};

// @desc   Register user
// @route  POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, phone });

    const token = generateToken(user.id);
    setCookieToken(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);
    setCookieToken(res, token);

    res.json({
      success: true,
      message: 'Login successful!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Logout
// @route  POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully.' });
};

// @desc   Get current user
// @route  GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc   Update profile
// @route  PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, phone, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)) {
      return res.status(400).json({ success: false, message: 'Name must be between 2 and 100 characters.' });
    }
    if (phone !== undefined && (typeof phone !== 'string' || phone.length > 20)) {
      return res.status(400).json({ success: false, message: 'Phone number must be 20 characters or fewer.' });
    }
    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return res.status(400).json({ success: false, message: 'Enter both the current and new password.' });
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe, updateProfile };
