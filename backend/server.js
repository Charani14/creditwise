require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { connectDB, sequelize } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import models (triggers associations)
require('./models/index');

// Import routes
const authRoutes = require('./routes/authRoutes');
const cardRoutes = require('./routes/cardRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const billingRoutes = require('./routes/billingRoutes');
const repaymentRoutes = require('./routes/repaymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const contactRoutes = require('./routes/contactRoutes');

const { startAlertJob } = require('./jobs/alertJob');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CreditWise API is running 🚀', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/repayments', repaymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  // Sync DB (alter: true preserves data while updating schema)
  await sequelize.sync({ alter: true });
  console.log('✅ Database synced');

  // Seed an administrator only when explicit credentials are configured.
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const { User } = require('./models');
    const bcrypt = require('bcryptjs');
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const adminExists = await User.findOne({ where: { email } });
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'CreditWise Admin',
        email,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
        role: 'admin',
        status: 'active',
      });
      console.log(`✅ Administrator account created for ${email}`);
    }
  }

  // Start cron job
  startAlertJob();

  app.listen(PORT, () => {
    console.log(`🚀 CreditWise server running on http://localhost:${PORT}`);
  });
};

startServer();
