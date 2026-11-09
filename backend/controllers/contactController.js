const { validationResult } = require('express-validator');
const { ContactMessage } = require('../models');

// @desc   Submit contact form
// @route  POST /api/contact
const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, subject, message } = req.body;
    const contact = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Your message has been received! We will get back to you soon.', contact });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact };
