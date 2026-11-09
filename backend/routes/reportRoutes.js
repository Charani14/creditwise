const express = require('express');
const { getMonthlySpending, getUtilizationReport, getCategorySpending } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/monthly', getMonthlySpending);
router.get('/utilization', getUtilizationReport);
router.get('/categories', getCategorySpending);

module.exports = router;
