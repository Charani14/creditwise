const express = require('express');
const { getNotifications, markRead, markAllRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllRead);
router.put('/:id', markRead);
router.delete('/:id', deleteNotification);

module.exports = router;
