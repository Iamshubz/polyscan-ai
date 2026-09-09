const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// In-memory fallback users database for offline/demo mode
const memoryUsers = [];

const generateToken = (id, email, name) => {
  const secret = process.env.JWT_SECRET || 'polyscan_ai_super_secret_jwt_key_2026';
  return jwt.sign({ id, email, name }, secret, { expiresIn: '30d' });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getIsConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash,
      });

      const token = generateToken(user._id, user.email, user.name);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } else {
      // Memory fallback
      const existing = memoryUsers.find((u) => u.email === normalizedEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const mockId = `mem_usr_${Date.now()}`;
      const newUser = {
        _id: mockId,
        name,
        email: normalizedEmail,
        passwordHash,
        createdAt: new Date(),
      };
      memoryUsers.push(newUser);

      const token = generateToken(mockId, newUser.email, newUser.name);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: mockId,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getIsConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = generateToken(user._id, user.email, user.name);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } else {
      let user = memoryUsers.find((u) => u.email === normalizedEmail);

      // Default demo account
      if (!user && normalizedEmail === 'demo@polyscan.ai') {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);
        user = {
          _id: 'demo_user_123',
          name: 'Demo User',
          email: 'demo@polyscan.ai',
          passwordHash,
          createdAt: new Date(),
        };
        memoryUsers.push(user);
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = generateToken(user._id, user.email, user.name);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (getIsConnected()) {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      return res.json({ success: true, user });
    } else {
      const user = memoryUsers.find((u) => String(u._id) === String(userId)) || {
        _id: userId,
        name: req.user.name || 'Demo User',
        email: req.user.email || 'demo@polyscan.ai',
        createdAt: new Date(),
      };
      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  memoryUsers,
};
