/**
 * Calculate credit utilization percentage
 * @param {number} outstanding - Current outstanding amount
 * @param {number} limit - Credit limit
 * @returns {number} Utilization percentage (can exceed 100 when over limit)
 */
const calculateUtilization = (outstanding, limit) => {
  if (!limit || limit <= 0) return 0;
  return (outstanding / limit) * 100;
};

/**
 * Calculate available credit
 * @param {number} limit - Credit limit
 * @param {number} outstanding - Current outstanding
 * @returns {number} Available credit
 */
const calculateAvailableCredit = (limit, outstanding) => {
  return Math.max(limit - outstanding, 0);
};

/**
 * Calculate days until a due date
 * @param {string} dueDate - Due date string (YYYY-MM-DD)
 * @returns {number} Days remaining (negative if overdue)
 */
const calculateDaysUntilDue = (dueDate) => {
  const dateOnly = (value) => String(value).slice(0, 10).split('-').map(Number);
  const [todayYear, todayMonth, todayDay] = dateOnly(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }));
  const [dueYear, dueMonth, dueDay] = dateOnly(dueDate);
  const today = Date.UTC(todayYear, todayMonth - 1, todayDay);
  const due = Date.UTC(dueYear, dueMonth - 1, dueDay);
  const diffMs = due - today;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Calculate minimum due (10% of total outstanding, min 200)
 * @param {number} totalAmount 
 * @returns {number}
 */
const calculateMinimumDue = (totalAmount) => {
  if (totalAmount <= 0) return 0;
  return Math.max(totalAmount * 0.1, 200);
};

/**
 * Get utilization level label and color
 * @param {number} utilization - Percentage
 * @returns {{ level: string, color: string }}
 */
const getUtilizationLevel = (utilization) => {
  if (utilization < 30) return { level: 'Good', color: '#22c55e' };
  if (utilization < 70) return { level: 'Moderate', color: '#f59e0b' };
  if (utilization < 85) return { level: 'High', color: '#f97316' };
  return { level: 'Critical', color: '#ef4444' };
};

/**
 * Generate the billing statement due date from card's dueDate day
 * @param {number} dueDay - Day of month
 * @param {number} month - Billing month (1-12)
 * @param {number} year - Billing year
 * @returns {Date}
 */
const getBillingDueDate = (dueDay, month, year) => {
  // Due date is typically in next month after billing month
  let dueMonth = month + 1;
  let dueYear = year;
  if (dueMonth > 12) {
    dueMonth = 1;
    dueYear += 1;
  }
  const lastDay = new Date(Date.UTC(dueYear, dueMonth, 0)).getUTCDate();
  return new Date(Date.UTC(dueYear, dueMonth - 1, Math.min(dueDay, lastDay)));
};

module.exports = {
  calculateUtilization,
  calculateAvailableCredit,
  calculateDaysUntilDue,
  calculateMinimumDue,
  getUtilizationLevel,
  getBillingDueDate,
};
