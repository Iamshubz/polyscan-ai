require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const polymerRoutes = require('./routes/polymerRoutes');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Connect MongoDB
connectDB();

// 2. Middleware & Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: '*', // Allow all origins for dev flexibility
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 4. Static folder for local uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/polymers', polymerRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'PolyScan AI Backend API',
    modelConfigured: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    timestamp: new Date(),
  });
});

// 6. Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`[PolyScan AI Backend] Server running on port ${PORT}`);
  console.log(`[PolyScan AI Backend] Configured Gemini Model: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`);
});
